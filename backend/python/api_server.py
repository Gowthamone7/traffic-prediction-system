"""
Python Prediction Service - Flask API
Interfaces between Node.js backend and PySpark ML model
File: python/api_server.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from datetime import datetime
import logging

# PySpark imports
from pyspark.sql import SparkSession
from pyspark.ml import PipelineModel
from pyspark.ml.feature import StringIndexer

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================================
# SPARK SESSION AND MODEL INITIALIZATION
# ============================================================================

class TrafficPredictor:
    def __init__(self):
        self.spark = None
        self.model = None
        self.route_indexer = None
        self.initialize()
    
    def initialize(self):
        """Initialize Spark session and load the model"""
        try:
            logger.info("Initializing Spark session...")
            self.spark = SparkSession.builder \
                .appName("TrafficPredictionAPI") \
                .config("spark.driver.memory", "2g") \
                .getOrCreate()
            
            self.spark.sparkContext.setLogLevel("ERROR")
            
            # Load the trained model
            model_path = os.getenv('MODEL_PATH', './models/traffic_model')
            if os.path.exists(model_path):
                logger.info(f"Loading model from {model_path}...")
                self.model = PipelineModel.load(model_path)
                logger.info("Model loaded successfully!")
            else:
                logger.warning(f"Model not found at {model_path}")
                self.model = None
            
            # Initialize route indexer
            self.route_indexer = StringIndexer(
                inputCol='route_id',
                outputCol='route_numeric'
            )
            
        except Exception as e:
            logger.error(f"Error initializing predictor: {str(e)}")
            raise
    
    def predict(self, route_id, hour, day_of_week, vehicle_count, 
                is_weekend=None, is_rush_hour=None):
        """Make a traffic congestion prediction"""
        
        if self.model is None:
            raise Exception("Model not loaded")
        
        # Calculate derived features
        if is_weekend is None:
            is_weekend = 1 if day_of_week in [1, 7] else 0
        
        if is_rush_hour is None:
            is_rush_hour = 1 if hour in [7, 8, 9, 17, 18, 19] else 0
        
        # Create input dataframe
        input_data = self.spark.createDataFrame([{
            'route_id': route_id,
            'hour': int(hour),
            'day_of_week': int(day_of_week),
            'is_weekend': int(is_weekend),
            'is_rush_hour': int(is_rush_hour),
            'vehicle_count': int(vehicle_count),
            'rolling_vehicle_count': int(vehicle_count)
        }])
        
        # Apply route indexer (this should match training)
        # Note: In production, you'd want to use the same indexer from training
        indexed_data = self.route_indexer.fit(input_data).transform(input_data)
        
        # Make prediction
        prediction = self.model.transform(indexed_data)
        
        # Extract prediction value
        pred_value = prediction.select('prediction').first()[0]
        
        # Determine congestion level
        if pred_value < 30:
            level = 'Low'
            confidence = 0.85
        elif pred_value < 60:
            level = 'Medium'
            confidence = 0.80
        else:
            level = 'High'
            confidence = 0.75
        
        return {
            'congestion_index': round(float(pred_value), 2),
            'congestion_level': level,
            'confidence': confidence
        }
    
    def predict_batch(self, predictions_data):
        """Make predictions for multiple scenarios"""
        if self.model is None:
            raise Exception("Model not loaded")
        
        results = []
        for data in predictions_data:
            try:
                result = self.predict(
                    route_id=data['route_id'],
                    hour=data['hour'],
                    day_of_week=data['day_of_week'],
                    vehicle_count=data['vehicle_count']
                )
                result['route_id'] = data['route_id']
                result['hour'] = data['hour']
                results.append(result)
            except Exception as e:
                logger.error(f"Error predicting for {data}: {str(e)}")
                results.append({
                    'route_id': data['route_id'],
                    'error': str(e)
                })
        
        return results

# Initialize predictor
predictor = TrafficPredictor()

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'model_loaded': predictor.model is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Single prediction endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['route_id', 'hour', 'day_of_week', 'vehicle_count']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Make prediction
        result = predictor.predict(
            route_id=data['route_id'],
            hour=data['hour'],
            day_of_week=data['day_of_week'],
            vehicle_count=data['vehicle_count'],
            is_weekend=data.get('is_weekend'),
            is_rush_hour=data.get('is_rush_hour')
        )
        
        return jsonify({
            'success': True,
            'prediction': result,
            'input': data,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """Batch prediction endpoint"""
    try:
        data = request.get_json()
        
        if 'predictions' not in data or not isinstance(data['predictions'], list):
            return jsonify({
                'error': 'predictions array is required'
            }), 400
        
        results = predictor.predict_batch(data['predictions'])
        
        return jsonify({
            'success': True,
            'predictions': results,
            'count': len(results),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/predict/hourly/<route_id>', methods=['POST'])
def predict_hourly(route_id):
    """Predict congestion for all 24 hours"""
    try:
        data = request.get_json()
        day_of_week = data.get('day_of_week', datetime.now().weekday() + 1)
        vehicle_count = data.get('vehicle_count', 80)
        
        predictions = []
        for hour in range(24):
            result = predictor.predict(
                route_id=route_id,
                hour=hour,
                day_of_week=day_of_week,
                vehicle_count=vehicle_count
            )
            result['hour'] = hour
            predictions.append(result)
        
        return jsonify({
            'success': True,
            'route_id': route_id,
            'day_of_week': day_of_week,
            'predictions': predictions,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Hourly prediction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        'model_loaded': predictor.model is not None,
        'model_path': os.getenv('MODEL_PATH', './models/traffic_model'),
        'spark_version': predictor.spark.version if predictor.spark else None,
        'timestamp': datetime.now().isoformat()
    })

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'timestamp': datetime.now().isoformat()
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'timestamp': datetime.now().isoformat()
    }), 500

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    logger.info("="*70)
    logger.info("🐍 TRAFFIC PREDICTION ML SERVICE")
    logger.info("="*70)
    logger.info(f"Port: {port}")
    logger.info(f"Debug: {debug}")
    logger.info(f"Model loaded: {predictor.model is not None}")
    logger.info("="*70)
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
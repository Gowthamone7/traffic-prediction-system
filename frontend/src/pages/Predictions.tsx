import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { 
  MapPin, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Navigation,
  Calendar,
  Loader
} from 'lucide-react';

interface PredictionResult {
  route: string;
  congestionLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  estimatedTime: number;
  alternativeRoutes?: Array<{
    route: string;
    time: number;
    congestion: string;
  }>;
}

const Predictions = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  
  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  useEffect(() => {
    if (prediction && resultRef.current) {
      gsap.from(resultRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });
    }
  }, [prediction]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulated API call - replace with actual backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPrediction: PredictionResult = {
        route: `${origin} → ${destination}`,
        congestionLevel: ['Low', 'Medium', 'High', 'Severe'][Math.floor(Math.random() * 4)] as any,
        estimatedTime: Math.floor(Math.random() * 60) + 15,
        alternativeRoutes: [
          { route: 'Route A (Highway)', time: 25, congestion: 'Medium' },
          { route: 'Route B (City Streets)', time: 35, congestion: 'Low' },
          { route: 'Route C (Mixed)', time: 30, congestion: 'Medium' },
        ],
      };

      setPrediction(mockPrediction);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-orange-500';
      case 'Severe': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getCongestionBg = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-500/20 border-green-500/50';
      case 'Medium': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'High': return 'bg-orange-500/20 border-orange-500/50';
      case 'Severe': return 'bg-red-500/20 border-red-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Traffic <span className="text-primary-500">Predictions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get real-time congestion predictions for your route
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Prediction Form */}
          <div ref={formRef}>
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Navigation className="w-6 h-6 text-primary-500 mr-3" />
                Enter Route Details
              </h2>

              <form onSubmit={handlePredict} className="space-y-6">
                {/* Origin */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Origin
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Enter starting location"
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Destination
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  />
                </div>

                {/* Time of Day */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Time of Day
                  </label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (6 AM - 10 AM)</option>
                    <option value="midday">Midday (10 AM - 3 PM)</option>
                    <option value="evening">Evening (3 PM - 8 PM)</option>
                    <option value="night">Night (8 PM - 6 AM)</option>
                  </select>
                </div>

                {/* Day of Week */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Day of Week
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    required
                  >
                    <option value="">Select day</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span>Predict Traffic</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Tips */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">💡 Quick Tips</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Best prediction accuracy during peak hours</li>
                <li>• Check alternative routes for better options</li>
                <li>• Historical data improves predictions over time</li>
                <li>• Real-time GPS data updates every minute</li>
              </ul>
            </div>
          </div>

          {/* Results */}
          <div>
            {prediction ? (
              <div ref={resultRef} className="space-y-6">
                {/* Main Prediction */}
                <div className={`card ${getCongestionBg(prediction.congestionLevel)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {prediction.route}
                      </h3>
                      <p className="text-gray-400">Predicted congestion level</p>
                    </div>
                    <AlertTriangle className={`w-8 h-8 ${getCongestionColor(prediction.congestionLevel)}`} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-3xl font-bold ${getCongestionColor(prediction.congestionLevel)}`}>
                        {prediction.congestionLevel}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Congestion Level</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-500">
                        {prediction.estimatedTime} min
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Estimated Time</p>
                    </div>
                  </div>
                </div>

                {/* Alternative Routes */}
                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Alternative Routes
                  </h3>
                  <div className="space-y-3">
                    {prediction.alternativeRoutes?.map((route, index) => (
                      <div
                        key={index}
                        className="glass-effect rounded-lg p-4 hover:border-primary-500/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">
                              {route.route}
                            </h4>
                            <p className={`text-sm ${getCongestionColor(route.congestion)}`}>
                              {route.congestion} Congestion
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-500">
                              {route.time}
                            </div>
                            <p className="text-xs text-gray-400">minutes</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Traffic Insights */}
                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Traffic Insights
                  </h3>
                  <div className="space-y-3 text-gray-400">
                    <p>🚦 Based on historical data from similar routes</p>
                    <p>📊 {Math.floor(Math.random() * 1000) + 500} vehicles on this route now</p>
                    <p>⏱️ Average speed: {Math.floor(Math.random() * 40) + 20} km/h</p>
                    <p>📈 Traffic increasing in the next hour</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card h-full flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-primary-500/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    No Predictions Yet
                  </h3>
                  <p className="text-gray-500">
                    Enter route details to get traffic predictions
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;

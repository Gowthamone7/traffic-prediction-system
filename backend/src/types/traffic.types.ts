// src/types/traffic.types.ts

export interface Route {
  id?: number;
  route_id: string;
  name: string;
  start_lat?: number;
  start_lng?: number;
  end_lat?: number;
  end_lng?: number;
  distance_km?: number;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TrafficData {
  id?: number;
  route_id: string;
  timestamp: Date;
  avg_speed: number;
  vehicle_count: number;
  congestion_index: number;
  congestion_level: 'Low' | 'Medium' | 'High';
  latitude?: number;
  longitude?: number;
  weather_condition?: string;
  temperature?: number;
  created_at?: Date;
}

export interface Prediction {
  id?: number;
  route_id: string;
  prediction_time: Date;
  predicted_for: Date;
  congestion_index: number;
  confidence: number;
  congestion_level: 'Low' | 'Medium' | 'High';
  created_at?: Date;
}

export interface PredictionRequest {
  route_id: string;
  hour: number;
  day_of_week: number;
  vehicle_count: number;
  is_weekend?: boolean;
  is_rush_hour?: boolean;
}

export interface PredictionResponse {
  route_id: string;
  predicted_congestion: number;
  congestion_level: 'Low' | 'Medium' | 'High';
  confidence: number;
  predicted_for: Date;
  factors: {
    hour: number;
    day_of_week: number;
    is_rush_hour: boolean;
    vehicle_count: number;
  };
}

export interface TrafficSummary {
  route_id: string;
  route_name: string;
  avg_congestion: number;
  current_congestion: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  vehicle_count: number;
  avg_speed: number;
}

export interface HourlyPattern {
  hour: number;
  avg_speed: number;
  avg_congestion: number;
  vehicle_count: number;
}

export interface RouteComparison {
  route_id: string;
  route_name: string;
  avg_congestion: number;
  peak_hours: number[];
  avg_speed: number;
}

export interface AnalyticsQuery {
  route_id?: string;
  start_date?: Date;
  end_date?: Date;
  hour?: number;
  day_of_week?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
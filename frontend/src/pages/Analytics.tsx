import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Activity, Clock, Users, Download } from 'lucide-react';

const Analytics = () => {
  const chartsRef = useRef<HTMLDivElement>(null);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    if (chartsRef.current) {
      gsap.from('.chart-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }
  }, []);

  // Sample data - replace with real API data
  const trafficByHour = [
    { hour: '00:00', traffic: 120 },
    { hour: '03:00', traffic: 80 },
    { hour: '06:00', traffic: 450 },
    { hour: '09:00', traffic: 880 },
    { hour: '12:00', traffic: 650 },
    { hour: '15:00', traffic: 720 },
    { hour: '18:00', traffic: 950 },
    { hour: '21:00', traffic: 580 },
  ];

  const weeklyData = [
    { day: 'Mon', congestion: 75, avgSpeed: 35 },
    { day: 'Tue', congestion: 82, avgSpeed: 32 },
    { day: 'Wed', congestion: 78, avgSpeed: 34 },
    { day: 'Thu', congestion: 85, avgSpeed: 30 },
    { day: 'Fri', congestion: 92, avgSpeed: 28 },
    { day: 'Sat', congestion: 45, avgSpeed: 50 },
    { day: 'Sun', congestion: 38, avgSpeed: 52 },
  ];

  const congestionDistribution = [
    { name: 'Low', value: 35, color: '#10b981' },
    { name: 'Medium', value: 40, color: '#eab308' },
    { name: 'High', value: 20, color: '#f97316' },
    { name: 'Severe', value: 5, color: '#ef4444' },
  ];

  const routeComparison = [
    { route: 'Highway A', time: 25, vehicles: 1200 },
    { route: 'City Route B', time: 35, vehicles: 800 },
    { route: 'Expressway C', time: 20, vehicles: 1500 },
    { route: 'Local Road D', time: 45, vehicles: 400 },
    { route: 'Ring Road E', time: 30, vehicles: 950 },
  ];

  const stats = [
    {
      icon: <Activity className="w-6 h-6" />,
      label: 'Active Routes',
      value: '1,247',
      change: '+12%',
      positive: true,
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Total Vehicles',
      value: '45.2K',
      change: '+8%',
      positive: true,
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Avg. Travel Time',
      value: '32 min',
      change: '-5%',
      positive: true,
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Prediction Accuracy',
      value: '94.3%',
      change: '+2%',
      positive: true,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Traffic <span className="text-primary-500">Analytics</span>
            </h1>
            <p className="text-xl text-gray-400">
              Real-time insights and historical traffic patterns
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
            <button className="btn-primary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="card hover:scale-105 transition-transform">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className={`text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change} from last period
                  </p>
                </div>
                <div className="text-primary-500 bg-primary-500/10 p-3 rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div ref={chartsRef} className="space-y-8">
          {/* Traffic by Hour */}
          <div className="chart-card card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Traffic Volume by Time of Day
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trafficByHour}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorTraffic)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Trends */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="chart-card card">
              <h2 className="text-2xl font-bold text-white mb-6">
                Weekly Congestion Levels
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="congestion" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card card">
              <h2 className="text-2xl font-bold text-white mb-6">
                Average Speed Trends
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgSpeed" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Congestion Distribution and Route Comparison */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="chart-card card">
              <h2 className="text-2xl font-bold text-white mb-6">
                Congestion Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={congestionDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {congestionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '0.5rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {congestionDistribution.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-400 text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card card">
              <h2 className="text-2xl font-bold text-white mb-6">
                Top Routes Comparison
              </h2>
              <div className="space-y-4">
                {routeComparison.map((route, index) => (
                  <div 
                    key={index}
                    className="glass-effect rounded-lg p-4 hover:border-primary-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{route.route}</h4>
                      <span className="text-primary-500 font-bold">{route.time} min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{route.vehicles.toLocaleString()} vehicles</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-dark-700 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(route.vehicles / 1500) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Updates */}
          <div className="chart-card card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Real-time Traffic Updates
            </h2>
            <div className="space-y-3">
              {[
                { time: '2 min ago', message: 'Heavy traffic detected on Highway A', type: 'warning' },
                { time: '5 min ago', message: 'Accident cleared on City Route B', type: 'success' },
                { time: '12 min ago', message: 'Road construction on Expressway C', type: 'info' },
                { time: '18 min ago', message: 'Peak hour congestion on Ring Road E', type: 'warning' },
              ].map((update, index) => (
                <div 
                  key={index}
                  className="glass-effect rounded-lg p-4 flex items-start space-x-4 hover:border-primary-500/50 transition-all"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    update.type === 'warning' ? 'bg-yellow-500' :
                    update.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white">{update.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

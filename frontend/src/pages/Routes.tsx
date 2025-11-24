import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Map, MapPin, Navigation, Clock } from 'lucide-react';

const Routes = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(contentRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  const popularRoutes = [
    {
      name: 'Downtown to Airport',
      distance: '24 km',
      avgTime: '28 min',
      traffic: 'Medium',
      savings: '15%',
    },
    {
      name: 'Business District Loop',
      distance: '12 km',
      avgTime: '18 min',
      traffic: 'High',
      savings: '22%',
    },
    {
      name: 'Suburban Connector',
      distance: '18 km',
      avgTime: '22 min',
      traffic: 'Low',
      savings: '10%',
    },
    {
      name: 'Highway Express',
      distance: '35 km',
      avgTime: '25 min',
      traffic: 'Medium',
      savings: '18%',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Popular <span className="text-primary-500">Routes</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore frequently traveled routes and their traffic patterns
            </p>
          </div>

          {/* Routes Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                className="card hover:scale-105 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{route.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Navigation className="w-4 h-4 mr-1" />
                        {route.distance}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {route.avgTime}
                      </span>
                    </div>
                  </div>
                  <MapPin className="w-6 h-6 text-primary-500" />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                  <div>
                    <p className="text-sm text-gray-400">Traffic Level</p>
                    <p className={`font-semibold ${
                      route.traffic === 'Low' ? 'text-green-500' :
                      route.traffic === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {route.traffic}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Time Savings</p>
                    <p className="font-semibold text-primary-500">{route.savings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">Route Visualization</h2>
            <div className="bg-dark-800 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-16 h-16 text-primary-500/20 mx-auto mb-4" />
                <p className="text-gray-400">Interactive map coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routes;

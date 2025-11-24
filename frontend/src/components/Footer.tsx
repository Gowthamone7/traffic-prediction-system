import React from 'react';
import { Activity, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-effect border-t border-dark-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">
                TrafficFlow
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Advanced traffic prediction system using PySpark and machine learning to 
              analyze GPS data and predict urban congestion patterns.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-primary-500 transition-colors">Home</a></li>
              <li><a href="/predictions" className="text-gray-400 hover:text-primary-500 transition-colors">Predictions</a></li>
              <li><a href="/analytics" className="text-gray-400 hover:text-primary-500 transition-colors">Analytics</a></li>
              <li><a href="/routes" className="text-gray-400 hover:text-primary-500 transition-colors">Routes</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TrafficFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

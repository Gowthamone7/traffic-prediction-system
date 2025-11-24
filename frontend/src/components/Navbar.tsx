import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity } from 'lucide-react';
import { gsap } from 'gsap';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (navRef.current) {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Predictions', path: '/predictions' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Routes', path: '/routes' },
  ];

  return (
    <nav ref={navRef} className="fixed top-0 w-full z-50 glass-effect border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Activity className="relative w-8 h-8 text-primary-500" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">
              TrafficFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 group ${
                  location.pathname === link.path
                    ? 'text-primary-500'
                    : 'text-gray-300 hover:text-primary-500'
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform origin-left transition-transform duration-300 ${
                    location.pathname === link.path
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/predictions" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-primary-500 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass-effect border-t border-dark-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary-500 bg-dark-800'
                    : 'text-gray-300 hover:text-primary-500 hover:bg-dark-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/predictions"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center btn-primary mt-4"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

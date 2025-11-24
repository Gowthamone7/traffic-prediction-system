import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Activity, 
  TrendingUp, 
  MapPin, 
  Clock, 
  BarChart3, 
  Zap,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animations
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      });

      gsap.from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power4.out',
      });

      gsap.from('.hero-buttons', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power4.out',
      });

      // Floating animation for hero decoration
      gsap.to('.float-animation', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Features cards animation
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // Stats animation
      gsap.from('.stat-item', {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        },
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Real-time Predictions',
      description: 'Get instant traffic congestion predictions based on live GPS data and historical patterns.',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Route Optimization',
      description: 'Find the fastest routes with AI-powered route suggestions that adapt to current conditions.',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Time-based Analysis',
      description: 'Analyze traffic patterns by time of day, day of week, and seasonal variations.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Visualize traffic data with interactive charts and comprehensive statistical insights.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'PySpark Processing',
      description: 'Lightning-fast big data processing powered by Apache Spark for scalable analysis.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Reliable & Accurate',
      description: 'Machine learning models trained on extensive datasets for high prediction accuracy.',
    },
  ];

  const stats = [
    { value: '99.5%', label: 'Prediction Accuracy' },
    { value: '< 100ms', label: 'Response Time' },
    { value: '1M+', label: 'Data Points/Day' },
    { value: '24/7', label: 'Real-time Monitoring' },
  ];

  const benefits = [
    'Reduce commute time by up to 30%',
    'Save fuel costs with optimized routes',
    'Real-time congestion alerts',
    'Historical traffic pattern analysis',
    'Multi-route comparison',
    'Integration-ready API',
  ];

  return (
    <div ref={heroRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl float-animation"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 glass-effect px-4 py-2 rounded-full mb-8 hero-subtitle">
              <Activity className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-gray-300">Powered by PySpark & Machine Learning</span>
            </div>

            {/* Title */}
            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-500 via-primary-400 to-primary-300 bg-clip-text text-transparent">
                Smart Traffic
              </span>
              <br />
              <span className="text-white">Prediction System</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
              Analyze GPS data to predict urban traffic congestion with advanced machine learning. 
              Get time-of-day and route-based predictions to save time and fuel.
            </p>

            {/* Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/predictions" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/analytics" className="btn-secondary text-lg px-8 py-4">
                View Analytics
              </Link>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="glass-effect rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300">
                    <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand and predict traffic patterns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card card group hover:scale-105 cursor-pointer"
              >
                <div className="text-primary-500 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-effect rounded-3xl p-12 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Why Choose TrafficFlow?
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  Make smarter decisions about your daily commute with data-driven insights
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-300 text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="glass-effect rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300">
                  <Globe className="w-full h-64 text-primary-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary-500 mb-2">
                        Real-time
                      </div>
                      <div className="text-2xl text-gray-400">Traffic Intelligence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-effect rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10"></div>
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Beat Traffic?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Start making data-driven decisions about your routes today
              </p>
              <Link to="/predictions" className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2">
                <span>Start Predicting</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

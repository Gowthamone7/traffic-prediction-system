import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Predictions from './pages/Predictions';
import Analytics from './pages/Analytics';
import RoutesPage from './pages/Routes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/routes" element={<RoutesPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

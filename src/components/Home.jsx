import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <section className="hero">
      <video autoPlay muted loop className="hero-video">
        <source src="https://assets.mixkit.co/active_storage/video_items/100545/1725385175/100545-video-720.mp4" type="video/mp4" />
      </video>
      
      <div className="hero-content">
        <h1 className="hero-title">
          <span>Transform Your</span>
          <span className="gradient-text">Fitness Journey</span>
        </h1>
        
        <p className="hero-subtitle">
          Track, Improve, and Achieve Your Fitness Goals with AI-Powered Insights
        </p>

        <div className="cta-container">
          <a href="/login" className="cta-btn login-btn">
            Get Started
            <span className="btn-icon">→</span>
          </a>
          <a href="/register" className="cta-btn register-btn">
            Join Now
            <span className="btn-icon">⚡</span>
          </a>
        </div>
      </div>

      <div className="floating-elements">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="floating-circle" style={{
            '--size': `${Math.random() * 50 + 30}px`,
            '--delay': `${i * 2}s`,
            '--duration': `${Math.random() * 8 + 10}s`
          }} />
        ))}
      </div>
    </section>
  );
};

export default Home;
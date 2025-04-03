import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <section className="hero">
      <div className="geometric-overlay" />
      <video autoPlay muted loop className="hero-video">
        <source src="https://assets.mixkit.co/active_storage/video_items/100545/1725385175/100545-video-720.mp4" type="video/mp4" />
      </video>
      
      <div className="hero-content">
        <div className="title-container">
          <h1 className="hero-title">
            <span>Transform Your</span>
            <span className="gradient-text">Fitness Journey</span>
            <span className="fitx-text">WITH FITX</span>
          </h1>
        </div>
        
        <p className="hero-subtitle">
          <span className="highlight">TRACK</span>
          <span className="highlight">IMPROVE</span>
          <span className="highlight">ACHIEVE</span>
        </p>

        <div className="cta-container">
          <a href="/login" className="cta-btn login-btn">
            <span className="btn-text">Get Started</span>
            <div className="btn-underline" />
            <span className="btn-icon">➞</span>
          </a>
          <a href="/register" className="cta-btn register-btn">
            <span className="btn-text">Join Now</span>
            <div className="btn-underline" />
            <span className="btn-icon">⏎</span>
          </a>
        </div>
      </div>

      <div className="particle-grid">
        {[...Array(64)].map((_, i) => (
          <div key={i} className="grid-particle" />
        ))}
      </div>
    </section>
  );
};

export default Home;
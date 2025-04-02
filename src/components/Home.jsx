import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Transform Your Fitness Journey</h1>
        <p className="hero-subtitle">Track, Improve, and Achieve Your Fitness Goals</p>
        
        <div className="cta-container">
          <a href="/login" className="cta-btn login-btn">Get Started</a>
          <a href="/register" className="cta-btn register-btn">Join Now</a>
        </div>
      </div>
    </section>
  );
};

export default Home;
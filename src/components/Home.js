// src/components/Home.js
import React from 'react';
import './Home.css';
import HeroSection from './HeroSection';
import Features from './Features';
import Introduction from './Introduction';
import CallToAction from './CallToAction';

function Home() {
  return (
    <div>
      <HeroSection/>
      <Introduction/>
      {/* <CallToAction/> */}
      <Features/>
      <div className="footer-decoration"></div>
    </div>
  );
}

export default Home;

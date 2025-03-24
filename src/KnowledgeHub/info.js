import React from 'react';
import './info.css';
import impactImage from '../images/knowledgehubimage1.jpeg';

const Info = () => {
  return (
    <div className="info-container">
      <h2>Why Should You Reduce Food Waste?</h2>
      <div className="info-content">
        <div className="image-container">
          <img src={impactImage} alt="Food Waste Impact" className="impact-image" />
        </div>
        <div className="text-content">
          <p>
            When food scraps and organic materials end up in landfills, they decompose without oxygen, releasing methane, a greenhouse gas 25 times more potent than carbon dioxide, contributing significantly to climate change.
          </p>
          <p>
            Transporting this heavy waste to landfills further increases the carbon footprint due to the pollution from large trucks. Additionally, as organic matter rots, it can combine with toxic chemicals from electronic waste, creating a hazardous sludge that may breach landfill barriers and contaminate water supplies.
          </p>
          <p>
            Although some landfills use methods like methane flaring and waste-to-energy systems to mitigate these issues, composting is a simple solution that can prevent the problem altogether.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;

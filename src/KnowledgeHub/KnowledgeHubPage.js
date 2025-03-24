import React from 'react';
import './KnowledgeHubPage.css';
import Info from './info';
import Visualization from './Visualization';
import HelpCouncil from './HelpCouncil';
import CarbonFootprint from './carbon_footprint';

const KnowledgeHubPage = () => {
  return (
    <div className="knowledge-hub-page">
      <Info />
      <Visualization />
      <HelpCouncil />
      <CarbonFootprint />
    </div>
  );
};

export default KnowledgeHubPage;

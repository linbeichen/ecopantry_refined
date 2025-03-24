import React, { useState } from 'react';
import './HelpCouncil.css';
import reduceFoodWasteImage from '../images/foodwaste.png'; // Ensure the path is correct
import compostingImage from '../images/compost.png'; // Ensure the path is correct
import segregateWasteImage from '../images/segregate.png'; // Ensure the path is correct
import seeMoreImage from '../images/Bin-Recycling.png'; // Ensure the path is correct
import popup_bin_image from '../images/knowledgeBinImg.jpg'; // Ensure the path is correct
 
const HelpCouncil = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
 
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
 
  return (
    <div className="help-council-container">
      <h2>What Can You Do To Help Your Council?</h2>
      <div className="help-council-section">
        <div className="help-card">
          <img src={reduceFoodWasteImage} alt="Reduce Food Waste" className="help-image" />
          <div className="help-content">
            <h3>Tips to Reduce Food Waste</h3>
            <p><strong>Buy what you need:</strong> Plan your meals, write shopping lists, and avoid impulse purchases. This will help you save money, reduce waste, and ensure that your meals are well-planned.</p>
            <p><strong>Store food wisely:</strong> Rotate the food in your fridge, freezer, and pantry so that older items are used first. Check expiration dates regularly and consider freezing food that you may not be able to use right away.</p>
            <p><strong>Make use of leftover ingredients:</strong> Turn excess ingredients into new dishes or soups for future consumption and avoid waste.</p>          
          </div>
        </div>
 
        <div className="help-card">
          <img src={compostingImage} alt="Composting" className="help-image-compost" />
          <div className="help-content">
            <h3>Composting</h3>
            <p><strong>What is Composting?</strong> Composting is the process of breaking down organic material, such as food scraps and garden waste, into a nutrient-rich soil conditioner.</p>
            <p><strong>How to Start:</strong> Start composting by using compost bins, worm farms, or bokashi bins. These systems can break down organic waste efficiently and are easy to maintain. Place your compost bin in a convenient location, such as near the garden or kitchen.</p>
            <p><strong>Benefits:</strong> Save money on garden fertilizers, reduce landfill waste, and improve soil health by using your own compost.</p>
          </div>
        </div>
 
        <div className="help-card small-card" onClick={togglePopup}>
          <div className="help-content center-content">
            {/* Display the image */}
            <img src={seeMoreImage} alt="See More Info" className="help-image-center" />
           
            {/* Add the "See More Info" text and arrow */}
            <div className="see-more-info">
              <h3 className="center-title">
                See More Info
              </h3>
             
            </div>
          </div>
        </div>
 
        <div className="help-card">
          <img src={segregateWasteImage} alt="Segregate Your Waste" className="help-image" />
          <div className="help-content">
            <h3>Segregate Your Waste</h3>
            <p><strong>Proper Disposal:</strong> Throw food and garden waste only in green bins. Ensure that recyclables are clean and placed in the correct bins to reduce contamination.</p>
            <p><strong>Use Council Services:</strong> Order free kitchen caddies and compostable liners from your council. Use these tools to make separating waste easy and efficient.</p>
            <p><strong>Environmental Impact:</strong> Proper waste segregation reduces landfill, recycles valuable materials, and helps create a sustainable environment.</p>
          </div>
        </div>
      </div>
 
      {/* Popup */}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={togglePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={togglePopup}>&times;</span>
            <img src={popup_bin_image} alt="Knowledge Bin" className="popup-image" />
          </div>
        </div>
      )}
    </div>
  );
};
 
export default HelpCouncil;
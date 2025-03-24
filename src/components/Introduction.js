import React from 'react';
import './Introduction.css';
import image1 from '../images/pantry.png'; // Replace with actual image paths
import image2 from '../images/sustainability.png';
import image3 from '../images/shoppingwaste.jpg';
 
function Introduction() {
    return (
        <div className="introduction">
            <h2>Why EcoPantry?</h2>
            <div className="images-container">
                <div className="image-item">
                    <img src={image3} alt="Food Waste Reduction" className="image-icon"/>
                    <p>Food Waste Reduction</p>
                </div>
                <div className="image-item">
                    <img src={image2} alt="Environment Sustainability" className="image-icon"/>
                    <p>Environment Sustainability</p>
                </div>
                <div className="image-item">
                    <img src={image1} alt="Food Security and Cost Saving" className="image-icon"/>
                    <p>Food Security and Cost Saving</p>
                </div>
            </div>
        </div>
    );
}
 
export default Introduction;
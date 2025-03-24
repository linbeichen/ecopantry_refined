import React from 'react';
import { Link } from 'react-router-dom';
import './Features.css';
import pantryImage from '../images/pantrymanagement.png';
import mealPlanningImage from '../images/mealplanning.png';
import wasteAnalyticsImage from '../images/wasteanalytics.png';
import shoppingListImage from '../images/shopping_list.png'; // 新增的图片引用
import knowledgeImage from '../images/knowledge.png';

function Features() {
    return (
        <div className="features-container">
            <h2 className="features-title">What We’re Offering</h2>
            <div className="features-grid">
                {/* Pantry Management: Step 1 */}
                <div className="feature-card">
                    <div className="step-label">Step 1</div>
                    <div className="feature-content">
                        <img src={pantryImage} alt="Pantry Management" className="feature-icon"/>
                        <div className="feature-text">
                            <h3>Pantry Management</h3>
                            <p>Manage your pantry with ease: upload shopping receipts, track items in your inventory, and edit expiry dates effortlessly.</p>
                            <Link to="/inventory" className="learn-more-button">Learn More &gt;&gt;</Link>
                        </div>
                    </div>
                </div>

                {/* Meal Planning: Step 2 */}
                <div className="feature-card">
                    <div className="step-label">Step 2</div>
                    <div className="feature-content">
                        <img src={mealPlanningImage} alt="Meal Planning" className="feature-icon"/>
                        <div className="feature-text">
                            <h3>Meal Planning</h3>
                            <p>Plan your meals effortlessly: get personalized recipe suggestions based on the items in your pantry.</p>
                            <Link to="/mealplan" className="learn-more-button">Learn More &gt;&gt;</Link>
                        </div>
                    </div>
                </div>

                {/* Waste Tracker: Step 3 */}
                <div className="feature-card">
                    <div className="step-label">Step 3</div>
                    <div className="feature-content">
                        <img src={wasteAnalyticsImage} alt="Waste Tracker" className="feature-icon"/>
                        <div className="feature-text">
                            <h3>Waste Analytics</h3>
                            <p>Reduce food waste with insights on how to cut down waste and make eco-friendly decisions.</p>
                            <Link to="/analytics" className="learn-more-button">Learn More &gt;&gt;</Link>
                        </div>
                    </div>
                </div>

                {/* Shopping List: Step 4 */}
                <div className="feature-card">
                    <div className="step-label">Step 4</div>
                    <div className="feature-content">
                        <img src={shoppingListImage} alt="Shopping List" className="feature-icon"/> {/* 更新图片 */}
                        <div className="feature-text">
                            <h3>Shopping List</h3>
                            <p>Create a Shopping List That Saves You Time, Money, and Reduces Waste!</p> {/* 更新描述 */}
                            <Link to="/shoppinglist" className="learn-more-button">Learn More &gt;&gt;</Link>
                        </div>
                    </div>
                </div>

                {/* Knowledge Hub: Step 5 */}
                <div className="feature-card">
                    <div className="step-label">Step 5</div>
                    <div className="feature-content">
                        <img src={knowledgeImage} alt="Knowledge Hub" className="feature-icon"/>
                        <div className="feature-text">
                            <h3>Knowledge Hub</h3>
                            <p>Explore the Knowledge Hub: learn about food waste, its environmental impact, and discover practical tips to reduce waste.</p>
                            <Link to="/knowledge-hub" className="learn-more-button">Learn More &gt;&gt;</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Features;

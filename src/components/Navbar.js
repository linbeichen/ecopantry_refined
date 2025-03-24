// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logoImage from '../images/logo.png';
import NotificationBell from './NotificationBell';

function Navbar({ inventory = [] }) {
    return (
        <nav className="navbar">
            <div className="logo">
                <img src={logoImage} alt="Logo" className="logo-img" />
                <span className="logo-text">ecopantry</span>
            </div>
            <div className="nav-links">
                <ul>
                    <li><Link to="/" className="nav-link">Home</Link></li>
                    <li><Link to="/inventory" className="nav-link">Inventory</Link></li>
                    <li><Link to="/mealplan" className="nav-link">Mealplan</Link></li>
                    <li><Link to="/analytics" className="nav-link">Waste Analytics</Link></li>
                    <li><Link to="/shoppingList" className="nav-link">Shopping List</Link></li>
                    <li><Link to="/knowledge-hub" className="nav-link">Knowledge Hub</Link></li>
                </ul>
                {/* NotificationBell 组件，用于显示过期物品和未来7天内即将过期的物品提示 */}
                <NotificationBell inventory={inventory} />
            </div>
        </nav>
    );
}

export default Navbar;

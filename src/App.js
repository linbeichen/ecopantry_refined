// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useStore from './store/store';
import Navbar from './components/Navbar';
import Home from './components/Home';
import FoodInventory from './Inventory/FoodInventory';
import KnowledgeHubPage from './KnowledgeHub/KnowledgeHubPage';
import Login from './components/Login';
import MealPlan from './MealPlan/MealPlan';
import AnalyticsPage from './Anylsis/AnalyticsPage';
import ShoppingListPage from './ShoppingList/ShoppingListPage';
import OnboardingGuide from './components/OnboardingGuide'; // Import the OnboardingGuide component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login status
  // const [inventory, setInventory] = useState([]); // Store inventory items
  const {inventory, loadInventoryFromStorage, } = useStore();
  const [runTutorial, setRunTutorial] = useState(false); // Control the onboarding guide

  // Read inventory from localStorage when the component mounts
  useEffect(() => {
    /*
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
      setInventory(JSON.parse(storedInventory));
    }
    */
    loadInventoryFromStorage();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true); // Update login state
    setRunTutorial(true); // Start the onboarding guide after login
  };

  /*
  // Stabilize handleInventoryUpdate function to avoid infinite dependencies
  const handleInventoryUpdate = useCallback((items) => {
    setInventory(items); // Update the inventory list
  }, []);
  */

  return (
    <Router>
      <div>
        {/* Pass inventory to Navbar to display notifications for expiring items */}
        <Navbar inventory={inventory} />

        {/* Render the OnboardingGuide component */}
        <OnboardingGuide runTutorial={runTutorial} setRunTutorial={setRunTutorial} />

        <Routes>
          {!isLoggedIn ? (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          ) : (
            <>
              <Route path="/" element={<Home />} />
              {/*<Route
                path="/inventory"
                element={<FoodInventory onInventoryUpdate={handleInventoryUpdate} />}
              />*/}
              <Route path="/inventory" element={<FoodInventory />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
              <Route path="/mealplan" element={<MealPlan />} />
              <Route path="/shoppinglist" element={<ShoppingListPage />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

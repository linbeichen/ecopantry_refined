// src/components/OnboardingGuide.js
import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import './OnboardingGuide.css';

function OnboardingGuide({ runTutorial, setRunTutorial }) {
  const [isReady, setIsReady] = useState(false);

  // Define the steps for the guide
  const steps = [
    {
      target: '.logo', // Navbar logo element
      content: 'Welcome to Ecopantry! ',
      placement: 'bottom',
    },
    {
      target: '.nav-links .nav-link[href="/inventory"]', // Inventory link
      content: 'Manage your pantry items in the Inventory section.',
      placement: 'bottom',
    },
    {
      target: '.nav-links .nav-link[href="/mealplan"]', // Mealplan link
      content: 'Plan your meals based on your inventory in the Mealplan section.',
      placement: 'bottom',
    },
    {
      target: '.nav-links .nav-link[href="/analytics"]', // Waste Analytics link
      content: 'Analyze your food waste and learn how to reduce it.',
      placement: 'bottom',
    },
    {
      target: '.nav-links .nav-link[href="/shoppingList"]', // Shopping List link
      content: 'Create and manage your shopping lists here.',
      placement: 'bottom',
    },
    {
      target: '.nav-links .nav-link[href="/knowledge-hub"]', // Knowledge Hub link
      content: 'Learn more about food waste and sustainability in the Knowledge Hub.',
      placement: 'bottom',
    },
    {
      target: '.notification-bell', // NotificationBell component
      content: 'Check notifications for items that are expired or expiring soon.',
      placement: 'bottom',
    },
  ];

  // Handle the guide's callback
  const handleJoyrideCallback = (data) => {
    const { status, index } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTutorial(false); // Close the tutorial when finished or skipped
    }
  };

  useEffect(() => {
    // Wait until all target elements are loaded
    const checkElementsLoaded = () => {
      const requiredElements = [
        document.querySelector('.logo'),
        document.querySelector('.nav-links .nav-link[href="/inventory"]'),
        document.querySelector('.nav-links .nav-link[href="/mealplan"]'),
        document.querySelector('.nav-links .nav-link[href="/analytics"]'),
        document.querySelector('.nav-links .nav-link[href="/shoppingList"]'),
        document.querySelector('.nav-links .nav-link[href="/knowledge-hub"]'),
        document.querySelector('.notification-bell'),
      ];

      const allElementsLoaded = requiredElements.every((el) => el !== null);
      if (allElementsLoaded) {
        setIsReady(true);
      } else {
        // Retry after a short delay
        setTimeout(checkElementsLoaded, 500);
      }
    };

    if (runTutorial) {
      checkElementsLoaded();
    }
  }, [runTutorial]);

  return (
    <Joyride
      steps={steps}
      run={isReady && runTutorial}
      callback={handleJoyrideCallback}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      scrollToFirstStep={true}
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  );
}

export default OnboardingGuide;

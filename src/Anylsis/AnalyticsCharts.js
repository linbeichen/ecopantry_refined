import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import './AnalyticsCharts.css';

const COLORS = [
  '#6c63ff', '#bdb3e6', '#8c6bae', '#55517a', '#ff6b6b', '#48dbfb', '#ff9f43', '#1dd1a1',
  '#f49f85', '#82ca9d', '#ffbb28', '#8884d8', '#d0ed57', '#a4de6c', '#ffc658', '#d885a3',
];

const EMISSION_FACTORS = {
  Dairy: 1.9,
  'Meat & Poultry': 27,
  Seafood: 6,
  'Bread & Bakery': 2,
  Beverages: 1,
  Snacks: 1.5,
  Condiments: 1.2,
  'Prepared foods': 4,
  Breakfast: 2,
  Fruits: 0.5,
  Vegetables: 0.3,
  other: 1,
};

const UNIT_CONVERSIONS = {
  ea: 0.1,
  g: 0.001,
  kg: 1,
  l: 1,
  mg: 0.000001,
  ml: 0.001,
  pack: 0.5,
  xg: 0.001,
  xml: 0.001,
};

const normalizeQuantity = (quantity, unit) => {
  const conversionFactor = UNIT_CONVERSIONS[unit] || 1; // Default conversion factor is 1
  const normalizedQuantity = quantity * conversionFactor;
  console.log(`Normalized Quantity: ${normalizedQuantity} from ${quantity} ${unit}`);
  return normalizedQuantity;
};

function AnalyticsCharts({ selectedOption, categoryData = [], expiredItems = [] }) {
  const [pieData, setPieData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (!categoryData || !expiredItems) return;

    // Generate data for quantity analysis pie chart
    const newPieData = categoryData.map((category, index) => {
      const itemsInCategory = expiredItems.filter((item) => {
        const itemCategory = item.category ? item.category.trim().toLowerCase() : '';
        const categoryName = category.name ? category.name.trim().toLowerCase() : '';
        return itemCategory === categoryName;
      });

      return {
        name: category.name,
        value: itemsInCategory.length,
        items: itemsInCategory,
        color: COLORS[index % COLORS.length],
      };
    });

    setPieData(newPieData);

    // Calculate total wasted cost data
    const totalCostData = categoryData.map((category, index) => {
      const itemsInCategory = expiredItems.filter((item) => item.category === category.name);
      const totalCost = itemsInCategory.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);

      return {
        name: category.name,
        value: Number(totalCost), // Ensure value is a number
        color: COLORS[index % COLORS.length],
      };
    });

    setCostData(totalCostData);
  }, [categoryData, expiredItems]);

  const handlePieClick = (data) => {
    setSelectedCategory(data);
  };

  const handleCloseTable = () => {
    setSelectedCategory(null);
  };

  // Calculate carbon footprint for each category based on expired items and their emission factors
  const carbonFootprintData = categoryData
    .map((category) => {
      const normalizedValue = normalizeQuantity(category.value, category.unit); // Normalize the value
      // Calculate the carbon footprint based on emission factors and normalized values
      return {
        name: category.name,
        value: (normalizedValue * (EMISSION_FACTORS[category.name] || 1)) / 10,
      };
    })
    .filter((item) => !isNaN(item.value) && isFinite(item.value) && item.value > 0); // Filter out invalid values

  return (
    <div className="charts-wrapper">
      {/* CO2 Emissions Analysis */}
      {selectedOption === 'co2' && (
        <div className="chart-section">
          <h3>CO2 Emissions Analysis by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={carbonFootprintData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, value }) => `${name}: ${typeof value === 'number' ? value.toFixed(2) : value} kg CO₂e`} // Show labels with units
                labelLine
                onClick={(data, index) => handlePieClick(carbonFootprintData[index])} // Handle click events
              >
                {carbonFootprintData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)} kg CO₂e` : value)} />
              <Legend formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)} kg CO₂e` : value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cost Analysis */}
      {selectedOption === 'cost' && (
        <div className="chart-section">
          <h3>Total Wasted Cost by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label={({ name, value }) => `${name}: $${typeof value === 'number' ? value.toFixed(2) : value}`} // Display cost with $ sign
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => (typeof value === 'number' ? `$${value.toFixed(2)}` : value)} />
              <Legend formatter={(value) => (typeof value === 'number' ? `$${value.toFixed(2)}` : value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quantity Analysis by Category (Expired Items) */}
      {selectedOption === 'quantity' && (
        <div className="chart-section">
          <h3>Quantity Analysis by Category (Expired Items)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                onClick={(data, index) => handlePieClick(pieData[index])}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Show Detailed Information Popup */}
      {selectedCategory && selectedCategory.items && (
        <>
          <div className="popup-backdrop" onClick={handleCloseTable}></div>
          <div className="popup-table">
            <h3>{selectedCategory.name} Category (Expired Items)</h3>
            <button onClick={handleCloseTable}>Close</button>
            <table className="frequency-items-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedCategory.items.length > 0 ? (
                  selectedCategory.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.fullName || item.name || 'Unnamed Item'}</td>
                      <td>{item.quantityValue || item.quantity || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center' }}>
                      No items found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p>Total Items: {selectedCategory.items.length}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsCharts;

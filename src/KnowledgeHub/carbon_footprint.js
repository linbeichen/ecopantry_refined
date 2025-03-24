import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; // CSV Parsing library
import GaugeChart from 'react-gauge-chart'; // Import the gauge chart library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Import info icon
import './carbon_footprint.css';

function CarbonFootprint() {
  // 选中的区域
  const [suburb, setSuburb] = useState(''); // Selected suburb
  // 议会列表
  const [councils, setCouncils] = useState([]); // List of councils
  // csv data 
  const [filteredData, setFilteredData] = useState([]); // Filtered CSV data
  // 
  const [carbonFootprint, setCarbonFootprint] = useState(null); // State to store carbon footprint value for the selected suburb
  // 平均碳足迹
  const [averageCarbonFootprint, setAverageCarbonFootprint] = useState(null); // State to store the average carbon footprint
  // 显示的碳足迹量
  const [displayedFootprint, setDisplayedFootprint] = useState(null); // State to store carbon footprint displayed after button click
  // 显示的区域名称
  const [displayedSuburb, setDisplayedSuburb] = useState(''); // State to store suburb displayed after button click
  // 加载状态
  const [loading, setLoading] = useState(false); // State to track loading status
  // 信息显示状态
  const [showInfo, setShowInfo] = useState(false); // State to show/hide info message

  // 加载CSV文件
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/carbonfootprint.csv`)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            const filtered = result.data.filter(
              (row) =>
                row.council !== undefined &&
                row.council.trim() !== '' &&
                row.Population !== undefined &&
                row.kerbside_organics_collected_tonnes !== undefined &&
                !isNaN(parseFloat(row.Population)) &&
                !isNaN(parseFloat(row.kerbside_organics_collected_tonnes))
            );

            const uniqueCouncils = [...new Set(filtered.map((item) => item.council))];

            setFilteredData(filtered);
            setCouncils(uniqueCouncils);

            const totalCarbonFootprint = filtered.reduce((acc, row) => {
              const kerbsideTonnes = parseFloat(row.kerbside_organics_collected_tonnes);
              const emissionFactor = 0.05; // Emission factor as discussed (tCO₂e/tonne)
              return acc + kerbsideTonnes * emissionFactor;
            }, 0);

            const averageFootprint = totalCarbonFootprint / filtered.length;
            setAverageCarbonFootprint(averageFootprint);
          },
          error: (error) => {
            console.error('Parsing Error:', error);
          },
        });
      })
      .catch((error) => console.error('Error loading CSV file:', error)); 
  }, []);

  const handleInputChange = (event) => {
    setSuburb(event.target.value); 
  };

  const handleSubmit = () => {
    setLoading(true);
    setDisplayedFootprint(null);
    setDisplayedSuburb('');

    setTimeout(() => {
      const selectedData = filteredData.find((item) => item.council === suburb);
      if (selectedData) {
        const kerbsideTonnes = parseFloat(selectedData.kerbside_organics_collected_tonnes);
        const emissionFactor = 0.05; 
        const calculatedFootprint = kerbsideTonnes * emissionFactor;
        setCarbonFootprint(calculatedFootprint);

        setDisplayedFootprint(calculatedFootprint);
        setDisplayedSuburb(suburb);
      }
      setLoading(false);
    }, 1500);
  };

  const handleInfoClick = () => {
    setShowInfo((prev) => !prev); // Toggle showInfo state on click
  };

  const calculateGaugePercent = () => {
    if (displayedFootprint === null || averageCarbonFootprint === null) return 0;
    const maxFootprint = 1000;
    let normalizedPercent = displayedFootprint / maxFootprint;
    if (normalizedPercent > 1) normalizedPercent = 1;
    return normalizedPercent;
  };

  return (
    <div className="carbon-footprint">
      {/* Updated Title */}
      <h2 className="title">
        Carbon Footprint Calculator
        {/* Info Icon */}
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="info-icon"
          onClick={handleInfoClick}
          title="Click to learn more"
        />
      </h2>
      
      {/* Info Message */}
      {showInfo && (
        <div className="info-message">
          <p>We calculate the emissions based on the amount of food waste generated in your suburb, showing the environmental impact in terms of carbon dioxide equivalent (CO₂e) emissions.</p>
        </div>
      )}

      <div className="calculator-container">
        <p>Enter your suburb and submit to discover how your community’s carbon emissions compare to others</p>
        <div className="input-container">
          <label htmlFor="suburb">Select your suburb (council area):</label>
          <select id="suburb" value={suburb} onChange={handleInputChange}>
            <option value="">Select Council</option>
            {councils.length > 0 ? (
              councils.map((council, index) => (
                <option key={index} value={council}>
                  {council}
                </option>
              ))
            ) : (
              <option disabled>No councils available</option>
            )}
          </select>
          <button onClick={handleSubmit}>Reveal</button>
        </div>

        {loading && (
          <div className="loading-spinner">
            <p>Calculating...</p>
          </div>
        )}

        {!loading && displayedFootprint !== null && (
          <div className="result-container">
            <h3>Carbon Footprint for {displayedSuburb}:</h3>
            <p>The estimated carbon footprint of food waste collected in {displayedSuburb} is approximately {displayedFootprint.toFixed(2)} tCO₂e.</p>
            <p>This value is {displayedFootprint > averageCarbonFootprint ? 'higher' : 'lower'} than the average carbon footprint of {averageCarbonFootprint.toFixed(2)} tCO₂e across all councils.</p>

            {/* Gauge Chart for Visual Representation */}
            <div className="gauge-chart-container">
              <GaugeChart
                id="gauge-chart"
                nrOfLevels={30}
                colors={['#00C49F', '#FFC371', '#FF5F6D']} 
                arcWidth={0.3}
                percent={calculateGaugePercent()} 
                textColor="#000000"
                formatTextValue={() => ''} // Hide the value text on the meter
              />
            </div>

            {/* Display Carbon Footprint Value Separately Below the Gauge */}
            <div className="footprint-value">
              <h4>{displayedFootprint.toFixed(2)} tCO₂e</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarbonFootprint;

import React, { useEffect, useRef, useState } from 'react';
import './Visualization.css';
import Papa from 'papaparse';
import { Chart, registerables } from 'chart.js';
 
Chart.register(...registerables);
 
const Visualization = () => {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const [councils, setCouncils] = useState([]);
    const [organicsCollected, setOrganicsCollected] = useState([]);
 
    useEffect(() => {
        // Parse the CSV file
        Papa.parse(require('./VLGAS_dataset (1).csv'), {
            download: true,
            header: true,
            complete: function(results) {
                processData(results.data);
            }
        });
 
        function processData(data) {
            // Filter data for the year 2020-2021
            const filteredData = data.filter(row => row.financial_year === '2020-2021');
 
            // Map councils and their kerbside organics collected
            let councils = filteredData.map(row => row.council);
            let organicsCollected = filteredData.map(row => parseFloat(row.kerbside_organics_collected_tonnes) || 0);
 
            // Create an array of objects to sort the councils based on organics collected
            const combinedData = councils.map((council, index) => ({
                council,
                organicsCollected: organicsCollected[index]
            }));
 
            // Sort the data in ascending order based on organics collected
            combinedData.sort((a, b) => b.organicsCollected - a.organicsCollected);
 
            // Extract the sorted councils and organicsCollected arrays
            councils = combinedData.map(item => item.council);
            organicsCollected = combinedData.map(item => item.organicsCollected);
 
            // Update the state and chart with the sorted data
            setCouncils(councils);
            setOrganicsCollected(organicsCollected);
            updateChart(councils, organicsCollected);
        }
    }, []);
 
    function updateChart(labels, data) {
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        const ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: `Kerbside Organics Collected (Tonnes) for 2020-2021`,
                    data,
                    backgroundColor: 'rgba(142, 68, 173, 0.8)',
                    borderColor: 'rgba(142, 68, 173, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 90
                        },
                        barThickness: 100, // Adjust this value as needed to increase bar size
                        maxBarThickness: 100
                    },
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: `Kerbside Organics Collected by Council for 2020-2021`,
                        padding: 20,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                }
            }
        });
    }
 
    return (
        <div className="visualization-container">
            <div className="header">
                <h1>Food Waste Collected by Victorian Councils (2020-2021)</h1>
            </div>
            <div className="scrollable-chart-container">
                <div className="chart-container">
                    <canvas ref={canvasRef}></canvas>
                </div>
            </div>
        </div>
    );
};
 
export default Visualization;
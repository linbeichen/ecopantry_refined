// Parse the CSV file
Papa.parse("VLGAS_dataset (1).csv", {
    download: true,
    header: true,
    complete: function(results) {
        processData(results.data);
    }
});

function processData(data) {
    // Filter data for the year 2020-2021
    let filteredData = data.filter(row => row.financial_year === '2020-2021');

    // Separate councils with and without kerbside organics collected values
    let councilsWithValues = filteredData.filter(row => parseFloat(row.kerbside_organics_collected_tonnes) > 0);
    let councilsWithoutValues = filteredData.filter(row => !row.kerbside_organics_collected_tonnes || parseFloat(row.kerbside_organics_collected_tonnes) === 0);

    // Sort councils with values in descending order
    councilsWithValues.sort((a, b) => parseFloat(b.kerbside_organics_collected_tonnes) - parseFloat(a.kerbside_organics_collected_tonnes));

    // Combine councils with values and councils without values (those without values at the end)
    const sortedData = [...councilsWithValues, ...councilsWithoutValues];

    const councils = sortedData.map(row => row.council);
    const kerbsideOrganicsCollected = sortedData.map(row => parseFloat(row.kerbside_organics_collected_tonnes) || 0);

    // Dynamically set the canvas width based on the total number of councils
    document.getElementById('myChart').style.width = `${councils.length * 50}px`; // 50px per council

    // Generate colors for each bar with a gradient transition
    const backgroundColors = councils.map((_, index) => getSubtleColor(index, councils.length));

    // Prepare the chart data
    const chartData = {
        labels: councils,
        datasets: [{
            label: 'Kerbside Organics Collected (Tonnes)',
            data: kerbsideOrganicsCollected,
            backgroundColor: backgroundColors,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    // Create the chart
    const config = {
        type: 'bar',
        data: chartData,
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
                    title: {
                        display: true,
                        text: 'Councils'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Kerbside Organics Collected (Tonnes)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    enabled: true
                },
                title: {
                    display: true,
                    text: 'Kerbside Organics Collection by Council (2020-2021)',
                    align: 'center',
                    position: 'top',
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                }
            }
        }
    };

    // Destroy the existing chart instance if it exists (prevents re-rendering issues)
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    // Create a new chart instance
    window.myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}

// Function to generate a range of subtle colors with a gradient
function getSubtleColor(index, total) {
    // Define a base color (light blue)
    const baseColor = [75, 192, 192]; // RGB for light blue

    // Calculate the intensity based on the index (reverse it to make the highest value the darkest)
    const intensity = 1 - (index / total) * 0.7; // Varies between 0.3 to 1.0

    // Adjust the color intensity to create a gradient effect
    const adjustedColor = baseColor.map(channel => Math.floor(channel * intensity));

    // Return the color in rgba format
    return `rgba(${adjustedColor[0]}, ${adjustedColor[1]}, ${adjustedColor[2]}, 1)`; // Full opacity
}

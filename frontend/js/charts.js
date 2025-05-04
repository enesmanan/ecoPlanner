// Chart functionality for ecoPlanner

document.addEventListener('DOMContentLoaded', function() {
    // Progress chart on dashboard
    const progressChartCanvas = document.getElementById('progressChart');
    
    if (progressChartCanvas) {
        // Generate some random data for the demo
        const generateRandomData = () => {
            return Array.from({length: 7}, () => Math.floor(Math.random() * 50) + 50);
        };
        
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        // Different metrics for the chart
        const ecoScoreData = generateRandomData();
        const planCompletionData = generateRandomData();
        const waterSavingData = generateRandomData();
        
        const progressChart = new Chart(progressChartCanvas, {
            type: 'line',
            data: {
                labels: weekDays,
                datasets: [
                    {
                        label: 'Eco Score',
                        data: ecoScoreData,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#4CAF50',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Plan Completion',
                        data: planCompletionData,
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#2196F3',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Water Saving',
                        data: waterSavingData,
                        borderColor: '#FFC107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#FFC107',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 6
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#263238',
                        bodyColor: '#263238',
                        borderColor: '#E0E0E0',
                        borderWidth: 1,
                        padding: 10,
                        bodySpacing: 5,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                elements: {
                    line: {
                        borderWidth: 2
                    }
                }
            }
        });
        
        // Function to update chart with new data
        window.updateProgressChart = function(newData) {
            progressChart.data.datasets.forEach((dataset, index) => {
                dataset.data = newData[index];
            });
            progressChart.update();
        };
    }
});
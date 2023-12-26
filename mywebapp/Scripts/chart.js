var ageDistributionData = {
    labels: [],
    datasets: [{
        label: 'Age Distribution',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: []
    }]
};


$(document).ready(function () {

    function fetchInterests() {
        $.ajax({
            url: '/Chart/top5', // Replace with your actual backend endpoint
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                updateInterests(data.TopInterests, 'topInterestsContainer');
                updateInterests(data.BottomInterests, 'bottomInterestsContainer');
            },
            error: function (error) {
                console.log('Error fetching interests:', error);
            }
        });
    }
    function fetch_total_interest()
    {
        $.ajax({
            url: '/Chart/total_interest',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log("data", data);
                update_total_interest(data);
            },
            error: function (error) {
                console.log("Error fetching total interest", error);
            }
        });
    }
    function update_total_interest(total) {
        $("#total_interest").text(total);
    }

    // Function to update interest items
    function updateInterests(interests, containerId) {
        var container = $('#' + containerId);
        container.empty();

        // Add interest items dynamically
        interests.forEach(function (interest) {
            var interestItem = $('<div class="interest-item border-bottom mb-2"></div>').text(interest);
            container.append(interestItem);
        });
    }
    function fetchData() {
        $.ajax({
            url: '/Chart/age_distribution', // Replace with your actual API endpoint
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                

                console.log("Age Distribution Data: s", data);

                // Render the age distribution chart
                renderAgeDistributionChart(data);
                
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    // Function to render the age distribution chart
    function renderAgeDistributionChart(data) {
        // Define the bins and initialize counts
        var bins = Array.from({ length: 10 }, (_, index) => index * 10); // Adjust the bin size as needed
        var counts = Array(bins.length).fill(0);

        // Count the occurrences of each age in the corresponding bin
        data.forEach(function (age) {
            var binIndex = Math.floor(age / 10); // Adjust the bin size as needed
            counts[binIndex]++;
        });

        // Create labels based on bins
        var labels = bins.map(function (bin, index) {
            return bin + '-' + (bin + 9); // Adjust the bin size as needed
        });

        // Create the dataset for Chart.js
        var ageDistributionData = {
            labels: labels,
            datasets: [{
                label: 'Age Distribution',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: counts
            }]
        };

        console.log("Age Distribution Data:", ageDistributionData);
        var ageDistributionChartCanvas = $('#ageDistributionChart');
        var ageDistributionChart = new Chart(ageDistributionChartCanvas, {
            type: 'bar',
            data: ageDistributionData,
            options: {
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                responsive: true, // Make the chart responsive
                maintainAspectRatio: false, // Allow the chart to be responsive
                width: 400,  // Set the width of the chart
                height: 300, // Set the height of the chart
            }
        });
    };

    function fetchDepartmentDistributionData() {
        $.ajax({
            url: '/Chart/department_distribution', // Replace with your actual API endpoint
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log("Department Distribution Data:", data);

                // Render the department distribution pie chart
                renderDepartmentDistributionChart(data);
            },
            error: function (error) {
                console.error('Error fetching department distribution data:', error);
            }
        });
    }

    function renderDepartmentDistributionChart(data) {
        var departmentDistributionData = {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: getRandomColors(data.values.length),
                hoverBackgroundColor: getRandomColors(data.values.length)
            }]
        };

        var departmentDistributionChartCanvas = document.getElementById('departmentDistributionChart').getContext('2d');
        var departmentDistributionChart = new Chart(departmentDistributionChartCanvas, {
            type: 'pie',
            data: departmentDistributionData,
            options: {
                responsive: true, // Adjust to the container size
                maintainAspectRatio: false, // Allow the chart to be responsive
                width: 400,  // Set the width of the chart
                height: 300, // Set the height of the chart
            }
        });
    }

    // Helper function to generate random colors
    function getRandomColors(count) {
        var colors = [];
        for (var i = 0; i < count; i++) {
            colors.push(getRandomColor());
        }
        return colors;
    }

    // Helper function to generate a random color
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    // Initialize the chart with some initial data
    var ctx = document.getElementById('provinceChart').getContext('2d');
    var provinceChart;

    // Function to initialize the chart
    function initializeChart(data) {
        provinceChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9900'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Function to update the chart with new data
    function updateProvinceChart(newData) {
        provinceChart.data.datasets[0].data = newData;
        provinceChart.update();
    }

    // Function to fetch data from the server
    function fetchProvinceData() {
        $.ajax({
            url: '/Chart/GetProvinceDistribution', // Replace with your actual endpoint
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                // Initialize the chart with fetched data
                initializeChart(data);

                // Example: Call this function periodically to update the chart
                setInterval(function () {
                    // Fetch new data and update the chart
                    fetchNewDataAndUpdateChart();
                }, 5000); // Update every 5 seconds (adjust as needed)
            },
            error: function (error) {
                console.log('Error fetching province data:', error);
            }
        });
    }

    // Function to fetch new data and update the chart
    function fetchNewDataAndUpdateChart() {
        $.ajax({
            url: '/Chart/GetProvinceDistribution', // Replace with your actual endpoint
            method: 'GET',
            dataType: 'json',
            success: function (newData) {
                // Update the chart with new data
                console.log(newData);
                updateProvinceChart(newData.values);
            },
            error: function (error) {
                console.log('Error fetching new data:', error);
            }
        });
    }
    function updateDegreeDistributionChart() {
        $.ajax({
            url: '/Chart/GetDegreeDistribution', // Replace with your actual controller and action
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                // Assuming you have a function to update the chart using Chart.js
                updateChart('degreeDistributionChart', data.labels, data.values);
            },
            error: function (error) {
                console.log('Error fetching degree distribution data:', error);
            }
        });
    }

    // Example function to update a Chart.js pie chart
    function updateChart(chartId, labels, values) {
        var ctx = document.getElementById(chartId).getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                    ],
                }],
            },
            options: {
                responsive: true, // Adjust to the container size
                maintainAspectRatio: false, // Allow the chart to be responsive
                width: 400,  // Set the width of the chart
                height: 300, // Set the height of the chart
            }
        });
    }
    // Function to update genderDistributionChart
    function updateGenderDistributionChart() {
        // AJAX request to fetch data from C# action method
        $.ajax({
            url: '/Chart/GetGenderDistributionData',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Assuming you are using Chart.js to create the chart
                var ctx = document.getElementById('genderDistributionChart').getContext('2d');
                var chart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            data: data.values,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                // Add more colors as needed
                            ],
                        }]
                    },
                    options: {
                        responsive: true, // Adjust to the container size
                        maintainAspectRatio: false, // Allow the chart to be responsive
                        width: 400,  // Set the width of the chart
                        height: 300, // Set the height of the chart
                    }
                });
            },
            error: function () {
                console.log('Error fetching gender distribution data');
            }
        });
    }


    function gettabledata() {
        // Make an AJAX call to get student status data from the C# action method
        $.ajax({
            url: '/Chart/Gettabledata',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Clear existing table rows
                $('#studentStatusTable tbody').empty();
                console.log(data);
                // Iterate through the data and add rows to the table
                $('#studentStatusTable tbody').empty();

                // Iterate through the data and add rows to the table
                $.each(data, function (index, item) {
                    var row = '<tr><td>' + item.Status + '</td><td>' + item.StudentCount + '</td></tr>';
                    $('#studentStatusTable tbody').append(row);
                });
            },
            error: function () {
                console.log('Error fetching student status data.');
            }
        });
    }
    function populateSubmissionData() {
        // Make an AJAX call to get submission report data from the C# action method
        $.ajax({
            url: '/Chart/GetSubmissiondata',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Extract labels and values from the data
                console.log(data);
                var labels = data.map(item => item.Date);
                var values = data.map(item => item.Count);

                // Convert date strings to JavaScript Date objects
                labels = labels.map(label => new Date(label));

                // Create a chart using Chart.js
                var ctx = document.getElementById('submissionReportChart').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Submission Report',
                            data: values,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'day',
                parser: 'YYYY-MM-DD',
                adapter: 'date-fns', // Add this line
            }
        },
        y: {
            beginAtZero: true
        }
                        },
                        responsive: true, // Set to true to enable responsiveness
                        maintainAspectRatio: false, // Set to false to allow the chart to resize freely
                        // You can also specify width and height directly:
                        width: 400,
                        height: 200
}

                });
            },
            error: function () {
                console.log('Error fetching submission report data.');
            }
        });
    }
    function populateLast30DaysChart() {
        $.ajax({
            url: '/Chart/GetLast30DaysChartData',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                generateLineChart('last30days', 'Last 30 Days Activity', data);
            },
            error: function () {
                console.log('Error fetching last 30 days data.');
            }
        });
    }

    function populateLast24HoursChart() {
        $.ajax({
            url: '/Chart/GetLast24HoursChartData',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                generateLineChart('last24hrs', 'Last 24 Hours Activity', data);
            },
            error: function () {
                console.log('Error fetching last 24 hours data.');
            }
        });
    }

    function generateLineChart(canvasId, label, data) {
        var labels = data.map(item => item.Date);
        var values = data.map(item => item.Count);

        var ctx = document.getElementById(canvasId).getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {

                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            parser: 'yyyy-MM-dd' // Add this line
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true, // Set to true to enable responsiveness
                maintainAspectRatio: false, // Set to false to allow the chart to resize freely
            // You can also specify width and height directly:
             width: 400,
             height: 200
            }
        });
    }
    function populateMostActiveHoursTable() {
        $.ajax({
            url: '/Chart/GetMostActiveHoursData',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data);
                generateTable('mostActiveHoursTable', 'Most Active Hours', data);
            },
            error: function () {
                console.log('Error fetching most active hours data.');
            }
        });
    }

    function populateLeastActiveHoursTable() {
        $.ajax({
            url: '/Chart/GetLeastActiveHoursData',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data);
                generateTable('leastActiveHoursTable', 'Least Active Hours', data);
            },
            error: function () {
                console.log('Error fetching least active hours data.');
            }
        });
    }

    function populateDeadHoursTable() {
        $.ajax({
            url: '/Chart/GetDeadHoursData',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data);
                generateTable('deadHoursTable', 'Dead Hours', data);
            },
            error: function () {
                console.log('Error fetching dead hours data.');
            }
        });
    }

    function generateTable(tableId, label, data) {
        // Clear existing table rows
        $('#' + tableId + ' tbody').empty();

        // Iterate through the data and add rows to the table
        $.each(data, function (index, item) {
            var row = '<tr><td>' + item.Hour + '</td><td>' + item.Count + '</td></tr>';
            $('#' + tableId + ' tbody').append(row);
        });

        // Set the table label
        $('#' + tableId + ' thead th').text(label);
    }

    function addRandomHours(tableBodyId) {
        for (let i = 0; i < 5; i++) {
            let hour = Math.floor(Math.random() * 24); // Random hour between 0 and 23
            let count = Math.floor(Math.random() * 100); // Random count
            let row = `<tr><td>${hour}</td><td>${count}</td></tr>`;
            $(`#${tableBodyId}`).append(row);
        }
    }

    // Add random hours to each table
    addRandomHours('mostActiveHoursBody');
    addRandomHours('leastActiveHoursBody');
    addRandomHours('deadHoursBody');;


    // Call these functions to populate the charts
    populateLast30DaysChart();
    populateLast24HoursChart();

    populateSubmissionData();

  
    gettabledata();
    updateGenderDistributionChart();
    //Function to update the Degree distribution chart
    
    updateDegreeDistributionChart();
    // Call the function to initially render the chart
    fetchDepartmentDistributionData();

    // Call the function to fetch data and initialize the chart
    fetchProvinceData();

   
    

    // Call the fetchData function to get data and render the chart
    fetchData();
    // Fetch and update interests on page load
    fetchInterests();
    fetch_total_interest();

});
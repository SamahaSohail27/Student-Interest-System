
        $(document).ready(function () {
            // Add Province Form Submission
            $("#addProvinceForm").submit(function (event) {
                event.preventDefault(); // Prevent the form from submitting the traditional way

                // Validate the Province Name field
                var provinceName = $("#provinceName").val().trim();
                if (provinceName === "") {
                    alert("Province Name is required.");
                    return;
                }

                // If validation passes, proceed with the AJAX request
                addProvince(provinceName);
            });
            // Assume this function is called when the page is loaded or when needed
            function updateProvinceDropdown() {
                // Make an AJAX request to fetch provinces
                $.ajax({
                    url: '/Management/GetProvinces', // Replace with your actual endpoint
                    method: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        // Clear existing options in the dropdown
                        $('#provinceDropdown').empty();

                        // Add a default option if needed
                        // $('#provinceDropdown').append('<option value="">Select Province</option>');

                        // Populate the dropdown with fetched province data
                        $.each(data, function (index, province) {
                            $('#provinceDropdown').append('<option value="' + province.ProvinceID + '">' + province.ProvinceName + '</option>');
                        });
                    },
                    error: function (xhr, status, error) {
                        console.log('Error fetching provinces:', xhr);
                    }
                });
            }

            // Call the function to update the dropdown when needed
            updateProvinceDropdown();

        // Function to make an AJAX request to add a Province
        function addProvince(provinceName) {
            $.ajax({
                url: '/Management/AddProvince', // Replace with your actual endpoint
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ provinceName: provinceName }),
                success: function (response) {
                    // Handle the success response, you might want to update the UI or fetch the list of provinces again
                    console.log('Province added successfully:', response);
                    updateProvinceDropdown();
                },
                error: function (xhr, status, error) {
                    console.log('Error adding province:', xhr.responseText);
                    // Handle the error, you might want to show an error message to the user
                }
            });
            }
            // Validate and submit the form on submit
            $("#addCityForm").submit(function (event) {
                // Prevent the default form submission
                event.preventDefault();

                // Validate the form
                if (validateForm()) {
                    // If the form is valid, submit it
                    submitForm();
                } else {
                    // If the form is not valid, show an alert or handle accordingly
                    alert("Form is not valid. Please check your input.");
                }
            });

            // Function to validate the form
            function validateForm() {
                var isValid = true;

                // Check if City Name is empty
                var cityName = $("#cityName").val();
                if (cityName.trim() === "") {
                    isValid = false;
                    $("#cityName").addClass("is-invalid");
                } else {
                    $("#cityName").removeClass("is-invalid");
                }

                // Check if Province Dropdown is selected
                var selectedProvince = $("#provinceDropdown").val();
                if (selectedProvince === null || selectedProvince === "") {
                    isValid = false;
                    $("#provinceDropdown").addClass("is-invalid");
                } else {
                    $("#provinceDropdown").removeClass("is-invalid");
                }

                return isValid;
            }

            // Function to submit the form
            function submitForm() {
                // Get form data
                var formData = {
                    CityName: $("#cityName").val(),
                    ProvinceID: $("#provinceDropdown").val()
                };

                // Use AJAX to submit the form data to the server
                $.ajax({
                    url: '/Management/AddCity', // Replace with your actual endpoint
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(formData),
                    success: function (response) {
                        // Handle the success response
                        console.log('City added successfully:', response);
                    },
                    error: function (xhr, status, error) {
                        // Handle the error response
                        console.log('Error adding city:', xhr.responseText);
                    }
                });
            }
          

            // Function to delete a City
            
            // Initial population of tables when the page loads
           
            populateProvinceTable();
            populateCityTable();
    });
function populateCityTable() {
    // Assuming you have an API endpoint to get the list of cities
    $.ajax({
        url: '/Management/GetCities', // Replace with your actual endpoint
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            // Clear existing table rows
            $('#cityTableContainer table tbody').empty();
            console.log(data);
            // Iterate over the data and add rows to the table
            $.each(data, function (index, city) {
                var row = '<tr>' +
                    '<td>' + city.CityID + '</td>' +
                    '<td>' + city.CityName + '</td>' +
                    '<td>' + city.ProvinceName + '</td>' +
                    '<td>' +
                    '<button class="btn btn-danger btn-sm" onclick="deleteCity(' + city.CityID + ')">Delete</button>' +
                    '</td>' +
                    '</tr>';
                $('#cityTableContainer table tbody').append(row);
            });
        },
        error: function (error) {
            console.log('Error fetching city data:', error);
        }
    });
}

// Function to populate Province Table
function populateProvinceTable() {
    // Assuming you have an API endpoint to get the list of provinces
    $.ajax({
        url: '/Management/GetProvinces', // Replace with your actual endpoint
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            // Clear existing table rows
            $('#provinceTableContainer table tbody').empty();

            // Iterate over the data and add rows to the table
            $.each(data, function (index, province) {
                var row = '<tr>' +
                    '<td>' + province.ProvinceID + '</td>' +
                    '<td>' + province.ProvinceName + '</td>' +
                    '<td>' +
                    '<button class="btn btn-danger btn-sm" onclick="deleteProvince(' + province.ProvinceID + ')">Delete</button>' +
                    '</td>' +
                    '</tr>';
                $('#provinceTableContainer table tbody').append(row);
            });
        },
        error: function (error) {
            console.log('Error fetching province data:', error);
        }
    });
}
function deleteCity(cityID) {
    // Assuming you have an API endpoint to delete a city
    $.ajax({
        url: '/Management/DeleteCity', // Replace with your actual endpoint
        method: 'POST',
        data: { id: cityID },
        success: function (response) {
            console.log('City deleted successfully:', response);
            // After deletion, refresh the City Table
            populateCityTable();
        },
        error: function (error) {
            console.log('Error deleting city:', error);
        }
    });
}

// Function to delete a Province
function deleteProvince(provinceID) {
    // Assuming you have an API endpoint to delete a province
    $.ajax({
        url: '/Management/DeleteProvince', // Replace with your actual endpoint
        method: 'POST',
        data: { id: provinceID },
        success: function (response) {
            console.log('Province deleted successfully:', response);
            // After deletion, refresh the Province Table
            populateProvinceTable();
        },
        error: function (error) {
            console.log('Error deleting province:', error);
        }
    });
}

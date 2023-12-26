$(document).ready(function () {
   

    populatecity();
    populatedepart();
    populateintrests();
    populateDegree();

    $("#interestDropdown").change(function () {
        var customInput = document.getElementById('customInterest');
        customInput.style.display = (this.value === '-1') ? 'block' : 'none';
    });

    $("#studentForm").submit(function (event) {
        // Prevent the form from submitting
        event.preventDefault();

        // Validate the form
        if (validateForm()) {
            alert("Form is valid. Submitting...");
            var intid = $("#interestDropdown").val();
            var customInput = $("#customInterest");

            if (intid < 0 && customInput.val().trim() !== "") {
                // If it's a custom interest, call verify
                verify();
            } else {
                // Otherwise, directly call addstudent
                addstudent();
            }
        } else {
            alert("Form is not valid. Please check your input.");
        }

           
        
    });
    function populatecity() {
        $.ajax({
            url: '/StudetnForm/GetCities', // Replace with your actual endpoint
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Populate the dropdown list with cities
                var citySelect = $('#city');

                data.forEach(function (city) {
                    citySelect.append($('<option>', {
                        value: city[0], // Use city.CityID
                        text: city[1]
                    }));
                });
            },
            error: function (xhr, status, error) {h
                console.log('Error retrieving cities:', xhr.responseText);
            }
        });

    }
    function populatedepart() {
      $.ajax({
            url: '/StudetnForm/Get_depart', // Replace with your actual endpoint
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Populate the dropdown list with cities
                var departselect = $('#department');
                console.log(data)

                data.forEach(function (depart) {
                    departselect.append($('<option>', {
                        value: depart[0], // Use city.CityID
                        text: depart[1]
                    }));
                });
            },
            error: function (xhr, status, error) {
                console.log('Error retrieving cities:', xhr.responseText);
            }
        });

    }
    function populateintrests() {
        var customInput = $("#customInterest").val();
        $.ajax({
            url: '/StudetnForm/Get_Interest', // Replace with your actual endpoint
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Populate the dropdown list with cities
                var departselect = $('#interestDropdown');
                console.log(data)

                data.forEach(function (interst) {
                    departselect.append($('<option>', {
                        value: interst[0], // Use city.CityID
                        text: interst[1]
                    }));
                });
               
            },
            error: function (xhr, status, error) {
                console.log('Error retrieving cities:', xhr.responseText);
            }
        });

    }
    function populateDegree() {
        $.ajax({
            url: '/StudetnForm/Get_Degree', // Replace with your actual endpoint
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Populate the dropdown list with cities
                var departselect = $('#degree');
                console.log("---------------------------------------------------");
                console.log(data)

                data.forEach(function (interst) {
                    departselect.append($('<option>', {
                        value: interst[0], // Use city.CityID
                        text: interst[1]                    }));
                });
            },
            error: function (xhr, status, error) {
                console.log('Error retrieving cities:', xhr.responseText);
            }
        });

    }
    // Function to validate the form
    function validateForm() {
        var isValid = true;

        // Loop through each input field
        $("#fullName, #rollNumber, #email, #gender, #dob, #interest, #department, #degree, #subject, #startDate, #endDate").each(function () {
            // Check if the field is empty and required
            if ($(this).val().trim() == "") {
                isValid = false;
                // Add the 'is-invalid' class to the input field
                $(this).addClass("is-invalid");
            } else {
                // Remove the 'is-invalid' class from the input field if it is not empty
                $(this).removeClass("is-invalid");
            }
        });

        return isValid;
    }
    function addinterest(interestName, callback) {
        // Send a POST request to add a new interest
        $.ajax({
            url: '/StudetnForm/AddInterest',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ interest: interestName }),
            success: function (response) {
                // Handle the success response
                console.log('Interest added successfully:', response);

                // Check if the returned InterestID is valid
                if (response && response.InterestID !== undefined && response.InterestID !== null) {
                    // Use the returned InterestID to select the option in the dropdown
                    var interestDropdown = $('#interestDropdown option:selected');
                    interestDropdown.val(response.InterestID);

                    // Invoke the callback function
                    if (typeof callback === 'function') {
                        callback();
                    }
                } else {
                    console.error('Invalid InterestID received from the server.');
                }
            },
            error: function (xhr, status, error) {
                console.log('Error adding interest:', xhr.responseText);

                // Invoke the callback function with an error flag (you can customize this based on your needs)
                if (typeof callback === 'function') {
                    callback(true);
                }
            }
        });
    }


    function verify() {
        // Create a student object with form data
        var intid = $("#interestDropdown").val();
        var customInput = $("#customInterest");

        // Call addinterest with addstudent as a callback
        addinterest(customInput.val(), function (error) {
            if (!error) {
                // Callback function without error, now you can call addstudent
                intid = $("#interestDropdown").val();
                console.log(intid);
                addstudent();
            } else {
                // Handle error, if needed
                console.error('Error adding interest. Cannot proceed with addstudent.');
            }
        });
    }


    function addstudent() {
       
        var studentData = {
            FullName: $("#fullName").val(),
            PhoneNumber: $("#phoneNumber").val(),
            EmailAddress: $("#email").val(),
            Gender: $("#gender").val(),
            DateOfBirth: $("#dob").val(),
            startDate: $('#startDate').val(),
            EndDate: $('#endDate').val(),
            RollNumber: $("#rollNumber").val(),
            Subject: $("#subject").val(),
            City: {
                CityID: $("#city").val(),
                CityName: $("#city option:selected").text(),
                // Add other City properties if needed
            },
            Interest: {
                InterestID: $("#interestDropdown").val(),
                InterestName: $("#interestDropdown option:selected").text(),
                // Add other Interest properties if needed
            },
            Depart: {
                DepartID: $("#department").val(),
                DepartName: $("#department option:selected").text(),
                // Add other Depart properties if needed
            },
            Degree: {
                DegreeID: $("#degree").val(),
                DegreeName: $("#degree option:selected").text(),
                // Add other Degree properties if needed
            }
            
            // Add other properties as needed
        };
        console.log(studentData);

        // Send a POST request to the server
        $.ajax({
            url: '/StudetnForm/PostStudent', // Replace with your actual endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(studentData),
            success: function (response) {
                // Handle the success response
                console.log('Student created successfully:', response);
            },
            error: function (xhr, status, error) {
                console.log('Error retrieving cities:', xhr.responseText);
            }
        });

    

    }
  
});
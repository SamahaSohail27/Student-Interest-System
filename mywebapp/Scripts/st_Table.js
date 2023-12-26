if (typeof jQuery === 'undefined') {
    console.error('jQuery is not loaded. Make sure it is included before your script.');
}
var activepage = 1;
var totalpage = 0;
var st_id = 0;
var admin = false;
$(document).ready(function () {
    // Initialize with a default page size
    var pageSize = 10;
    fetchTotalPages();
    fetchData(1, pageSize);
    console.log($('.pagination')); // Log the selected element
    function getAdmin() {
        $.ajax({
            url: "/Show/getadmin",
            type: "GET",
            dataType: "json",
            success: function (data) {
                var admin = data;

                // Disable or enable buttons based on the 'admin' value
                disableButtons(!admin);
            },
            error: function () {
                console.error("Error fetching admin status from the server.");
            }
        });
    }

    function disableButtons(disable) {
        // Disable or enable buttons based on the 'disable' parameter
        $(".btn-info, .btn-warning, .btn-danger").prop("disabled", disable);
    }

    // Call the function to get the admin status and disable buttons accordingly
    
    function fillTable(data) {
        var tableBody = $('#studentTable tbody');
        tableBody.empty(); // Clear existing data

        $.each(data, function (index, item) {
            var dateStr = item.DateOfBirth;
            var timestamp = parseInt(dateStr.substr(6));
            var date = new Date(timestamp).toLocaleDateString();
            var row = '<tr>' +
                '<td>' + item.StudentID + '</td>' +
                '<td>' + item.FullName + '</td>' +
                '<td>' + item.EmailAddress + '</td>' +
                '<td>' + item.Gender + '</td>' +
                '<td>' + date + '</td>' +
                '<td>' + item.City + '</td>' +
                '<td>' + item.Interest + '</td>' +
                '<td>' + item.Degree + '</td>' +
                '<td style="white-space: nowrap;">' +
                '<button class="btn btn-info btn-sm" onclick="viewStudent(' + item.StudentID + ')">View</button>' +
                '<span style="display: inline-block; margin: 0 5px;"></span>' +
                '<button class="btn btn-warning btn-sm" onclick="editStudent(' + item.StudentID + ')">Edit</button>' +
                '<span style="display: inline-block; margin: 0 5px;"></span>' +
                '<button class="btn btn-danger btn-sm" onclick="deleteStudent(' + item.StudentID + ')">Delete</button>' +
                '</td>' +
                '</tr>';

            tableBody.append(row);
        });
    }

    // Function to fetch data from the server
    function fetchTotalPages() {
        $.ajax({
            url: '/Show/totalpages', // Replace with your actual backend endpoint
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                // Once the total number of pages is received, generate pagination
                generatePagination(data);
                console.log(data);
                totalpage =data
            },
            error: function (xhr, status, error) {
                console.log('Error fetching total pages:', xhr);
            }
        
        });
    }
    function fetchData(page, size) {
        console.log(page);
        if (page == 0) {
            page = 1;
        }

        $.ajax({
            url: '/Show/filltable',
            method: 'GET',
            dataType: 'json',
            data: { page: page, pageSize: size },
           
            success: function (data) {
                fillTable(data);
            },
            error: function (error) {
                console.log('Error fetching data:', error);
                
            }
        });
    }
    function generatePagination(totalPages) {
        var paginationContainer = $('.pagination');

        // Clear existing pagination
        paginationContainer.empty();

        // Add pagination elements
        paginationContainer.append('<li class="page-item"><a class="page-link" href="#" aria-label="First"><span aria-hidden="true">&laquo;&laquo;</span></a></li>');
        paginationContainer.append('<li class="page-item"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>');

        for (var i = 1; i <= totalPages; i++) {
            paginationContainer.append('<li class="page-item"><a class="page-link" href="#" data-page="' + i + '">' + i + '</a></li>');
        }

        paginationContainer.append('<li class="page-item"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
        paginationContainer.append('<li class="page-item"><a class="page-link" href="#" aria-label="Last"><span aria-hidden="true">&raquo;&raquo;</span></a></li>');
    }

    // Function to update the pagination dynamically
  
        $('.pagination').on('click', 'a', function (e) {
            e.preventDefault();

            var clickedElement = $(this);
            var page = clickedElement.data('page');

            if (clickedElement.hasClass('page-link') && page !== undefined) {
                console.log('Clicked page:', page);
                fetchData(page, pageSize);
            } else if (clickedElement.attr('aria-label') === 'Next') {
                // Handle Next button click
                var currentPage = activepage;
                var nextPage = currentPage + 1;
                activepage++;
                fetchData(nextPage, pageSize);
            } else if (clickedElement.attr('aria-label') === 'Previous') {
                // Handle Previous button click
                var prevPage = activepage;
                var currentPage = activepage;
                if (activepage >= 1) {
                    var prevPage = currentPage - 1;
                    activepage--;
                }
                
                fetchData(prevPage, pageSize);
            } else if (clickedElement.attr('aria-label') === 'First') {
                // Handle First button click
                fetchData(1, pageSize);
            } else if (clickedElement.attr('aria-label') === 'Last') {
                // Handle Last button click
               // var totalPages = Math.ceil(dataLength / pageSize);
                fetchData(totalpage, pageSize);
            }
        });





    

    // Example functions for view, edit, and delete
   
    // Example of setting pageSize dynamically (you can replace this with your logic)
    $('#pageSizeInput').on('change', function () {
        pageSize = parseInt($(this).val());
        fetchData(1, pageSize);
    });
    $('#updatebtn').click(function () {
       
        if (validateForm()) {
            alert("Form is valid. Submitting...");
            var intid = $("#interestDropdown").val();
            var customInput = $("#customInterest");

            if (intid < 0 && customInput.val().trim() !== "") {
                // If it's a custom interest, call verify
                verify();
            } else {
                // Otherwise, directly call addstudent
                update_Student();
            }
        } else {
            alert("Form is not valid. Please check your input.");
        }
    });
    getAdmin();

});
function viewStudentDetails(studentID) {
    var url = '/show/GetStudentData';
    $('#studentFormContainer').show();
    $("#submitBtn").hide();
    $("#updatebtn").hide();

    // Fetch data using AJAX
    $.ajax({
        url: url,
        type: 'POST',
        data: { id: studentID },
        dataType: 'json',
        success: function (data) {
            if (data) {
                // Update the form fields with the retrieved data
                $('#fullName').val(data.FullName || '');
                $('#rollNumber').val(data.RollNumber || '');
                $('#email').val(data.EmailAddress || '');
                $('#subject').val(data.Subject || '');
                $('#gender').val(data.V || '');

                if (data.DateOfBirth !== null) {
                    var dob = new Date(parseInt(data.DateOfBirth.substr(6)));
                    var formattedDob = dob.toISOString().split('T')[0];
                    $('#dob').val(formattedDob);
                } else {
                    $('#dob').val('');
                }

                $('#interestDropdown').val(data.InterestID || '');
                $('#department').val(data.DepartID || '');
                $('#degree').val(data.DegreeID || '');
                $('#city').val(data.CityID || '');

                if (data.StartDate !== null) {
                    var startDate = new Date(parseInt(data.StartDate.substr(6)));
                    var formattedStartDate = startDate.toISOString().split('T')[0];
                    $('#startDate').val(formattedStartDate);
                } else {
                    $('#startDate').val('');
                }

                if (data.EndDate !== null) {
                    var endDate = new Date(parseInt(data.EndDate.substr(6)));
                    var formattedEndDate = endDate.toISOString().split('T')[0];
                    $('#endDate').val(formattedEndDate);
                } else {
                    $('#endDate').val('');
                }

                // Disable form fields to prevent editing
                disableFormFields();

                // Optionally, you can show a message or customize UI for view mode
                console.log('Student details viewed successfully:', data);
            }
        },
        error: function (error) {
            console.log('Error fetching data: ', error);
        }
    });
}

function disableFormFields() {
    // Disable all form fields
    $('#studentForm input, #studentForm select').prop('disabled', true);
    // Optionally, you can style the disabled fields to indicate view mode
    // $('#studentForm input, #studentForm select').addClass('view-mode');
}
function enableFormFields() {
    // Enable all form fields
    $('#studentForm input, #studentForm select').prop('disabled', false);
    // Optionally, you can remove the 'view-mode' class to revert styles
    // $('#studentForm input, #studentForm select').removeClass('view-mode');
}



// Example of calling viewStudentDetails
function viewStudent(studentID) {
    // Reset the form (clear any previous disabled state)
    $('#studentForm input, #studentForm select').prop('disabled', false);
    $('#studentForm').show();

    // Assuming you have a "View" button for each student row
    viewStudentDetails(studentID);
}

function deleteStudent(studentID) {
    // Ask for user confirmation
    var confirmDelete = confirm('Are you sure you want to delete this student?');

    if (confirmDelete) {
        // User confirmed, proceed with the delete operation
        $.ajax({
            url: '/Show/Delete', // Replace with your actual endpoint
            type: 'POST',
            data: { id: studentID }, // Include studentID as POST parameter
            success: function (response) {
                // Handle the success response
                console.log('Student deleted successfully:', response);
                // Optionally, you can update the table or perform other actions
                fetchData(activepage, pageSize);
            },
            error: function (xhr, status, error) {
                console.log('Error deleting student:', xhr.responseText);
            }
        });
    } else {
        // User canceled the delete operation
        console.log('Delete operation canceled by the user.');
    }
}

function editStudent(studentID) {
    st_id = studentID;
    $("#submitBtn").hide();
    $("#updatebtn").show();
    $('#studentFormContainer').show();

    var url = '/show/GetStudentData';

    // Fetch data using AJAX
    $.ajax({
        url: url,
        type: 'POST', // Use POST method
        data: { id: studentID }, // Include studentID as POST parameter
        dataType: 'json',
        success: function (data) {
            // Check if data is not null
            console.log(data)
            if (data) {
                // Update the form fields with the retrieved data

                // Update text fields
                $('#fullName').val(data.FullName || '');
                $('#rollNumber').val(data.RollNumber || '');
                $('#email').val(data.EmailAddress || '');
                $('#subject').val(data.Subject || '');

                // Set selected value for the gender dropdown
                $('#gender').val(data.V || '');


                // Set date of birth
                if (data.DateOfBirth !== null) {
                    var dob = new Date(parseInt(data.DateOfBirth.substr(6)));
                    var formattedDob = dob.toISOString().split('T')[0];
                    $('#dob').val(formattedDob);
                } else {
                    $('#dob').val('');
                }

                // Set selected value for the interest dropdown
                // Assuming there is an 'InterestName' property in data
                $('#interestDropdown').val(data.InterestID || '');

                // Update other fields similarly

                // Update dropdowns
                $('#department').val(data.DepartID || '');
                $('#degree').val(data.DegreeID || '');
                $('#city').val(data.CityID || '');

                // Set start date
                if (data.StartDate !== null) {
                    var startDate = new Date(parseInt(data.StartDate.substr(6)));
                    var formattedStartDate = startDate.toISOString().split('T')[0];
                    $('#startDate').val(formattedStartDate);
                } else {
                    $('#startDate').val('');
                }

                // Set end date
                if (data.EndDate !== null) {
                    var endDate = new Date(parseInt(data.EndDate.substr(6)));
                    var formattedEndDate = endDate.toISOString().split('T')[0];
                    $('#endDate').val(formattedEndDate);
                } else {
                    $('#endDate').val('');
                }
                enableFormFields();
            }
        },
        error: function (error) {
            console.log('Error fetching data: ', error);
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
            update_Student();
        } else {
            // Handle error, if needed
            console.error('Error adding interest. Cannot proceed with addstudent.');
        }
    });
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
function update_Student() {
    var studentData = {
        StudentID:st_id,
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
    $.ajax({
        url: '/Show/Update', // Replace with your actual endpoint
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
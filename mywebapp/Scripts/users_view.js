$(document).ready(function () {
    // Fetch user data from the server
    $.ajax({
        url: "/ManageUser/GetUserData",
        type: "GET",
        dataType: "json",
        success: function (data) {
            // Populate the table with user data
            populateTable(data);
        },
        error: function () {
            console.error("Error fetching user data.");
        }
    });
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


    // Attach a change event listener to the status dropdown
    $("#userTableBody").on("change", ".statusDropdown", function () {
        // Get the selected value from the dropdown
        var selectedStatusId = $(this).val();

        // Get the corresponding user ID from the data attribute
        var userId = $(this).data("userid");

        // Show a confirmation dialog to the user
        var isConfirmed = confirm("Are you sure you want to update the user status?" + userId);

        if (isConfirmed) {
            // Call a function to update the user with the selected status
            updateUserStatus(userId, selectedStatusId);
        } else {
            // Reset the dropdown to the previous value or perform any other desired action
            // You can implement this based on your requirements
        }
    });
    getAdmin();
});

// Function to populate the table with user data
function populateTable(userData) {
    var tableBody = $("#userTableBody");

    // Clear existing rows
    tableBody.empty();

    // Iterate through user data and create rows
    $.each(userData, function (index, user) {
        var newRow = $("<tr>");
        newRow.append("<td>" + user.UserName + "</td>");
        newRow.append("<td>" + user.UserEmail + "</td>");
        newRow.append("<td>" + user.PhoneNumber + "</td>");
        newRow.append("<td>" + convertJsonDateToReadableFormat(user.RegistrationDate) + "</td>");
        newRow.append("<td>" + user.RoleName + "</td>");
        newRow.append("<td>" + user.Gender + "</td>");
        newRow.append("<td>" + user.Address + "</td>");

        // Add a dropdown for the status column
        // Add a dropdown for the status column
        var statusDropdown = $("<td>").append(createStatusDropdown(user.Status, user.userid));
        newRow.append(statusDropdown);


        // Append the row to the table
        tableBody.append(newRow);
    });
}


// Function to update the user status via AJAX
function updateUserStatus(userId, selectedStatusId) {
    // Make an AJAX request to update the user status
    $.ajax({
        url: "/ManageUser/UpdateUserStatus",
        type: "POST",
        data: {
            userId: userId,
            statusId: selectedStatusId
        },
        success: function (response) {
            // Handle the success response (e.g., show a success message)
            console.log("User status updated successfully.");
        },
        error: function () {
            // Handle the error (e.g., show an error message)
            console.error("Error updating user status.");
        }
    });
}

// Function to create a status dropdown
// Function to create a status dropdown
function createStatusDropdown(selectedStatusId, userId) {
    var dropdown = $("<select>", { class: "form-control statusDropdown", "data-userid": userId });

    // Array containing status data
    var statusData = [
        { id: 1, status_value: "Active" },
        { id: 2, status_value: "Inactive" },
        { id: 3, status_value: "Pending" }
    ];

    // Populate dropdown options
    $.each(statusData, function (index, status) {
        var option = $("<option>", {
            value: status.id,
            text: status.status_value,
            selected: status.id === selectedStatusId
        });
        dropdown.append(option);
    });

    return dropdown;
}


function convertJsonDateToReadableFormat(jsonDate) {
    var date = new Date(parseInt(jsonDate.substr(6)));
    return date.toLocaleString();
}
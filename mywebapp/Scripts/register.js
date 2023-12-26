$(document).ready(function () {
    // Function to populate the "Role" dropdown
    function populateRoles() {
        // Make an AJAX request to fetch roles
        $.ajax({
            url: "/ManageUser/GetRoles",
            type: "GET",
            dataType: "json",
            success: function (data) {
                // Clear existing options
                $("#role_id").empty();

                // Add options based on the retrieved data
                $.each(data, function (index, role) {
                    $("#role_id").append('<option value="' + role.Id + '">' + role.Name + '</option>');
                });
            },
            error: function (xhr, status, error) {
                console.error("AJAX error:", status, error);
                console.log(xhr.responseText); // Log the response text for more details
            }
        });

    }

    // Call the function to populate roles on page load
    populateRoles();

    function validateForm() {
        // Add your validation logic here
        // For simplicity, this example assumes all fields are required
        var isValid = true;

        // Check each input field
        $("form#addUserForm input[type=text], form#addUserForm input[type=password], form#addUserForm input[type=email]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                // You can customize the error handling (e.g., displaying a message) here
                alert('Please fill in all the required fields.');
                return false; // Exit the loop early if any field is empty
            }
        });

        // Add additional validation as needed

        return isValid;
    }

    // Handle form submission
    $("#addUserForm").on("submit", function (e) {
        e.preventDefault();

        // Validate the form
        if (validateForm()) {
            // If the form is valid, proceed with AJAX submission

            // Collect form data
            var formData = $(this).serialize();

            // Make an AJAX request to submit data
            $.ajax({
                url: "/ManageUser/AddUser", // Update the URL based on your actual controller route
                type: "POST",
                data: formData,
                success: function (response) {
                    // Handle the response from the server
                    console.log(response);
                    // Optionally, you can redirect or perform other actions based on the response
                },
                error: function () {
                    console.error("Error submitting form data.");
                }
            });
        }
    });
});
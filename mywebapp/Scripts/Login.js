$(document).ready(function () {
    // Click event for the Register link
    $("form").submit(function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Perform client-side validation
        var email = $("#email").val();
        var password = $("#password").val();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        // If validation passes, make an AJAX request
        $.ajax({
            url: "/ManageUser/Login", // Update the URL based on your actual controller route
            type: "POST",
            data: {
                email: email,
                password: password
            },
            success: function (response) {
                // Handle the response from the server
                console.log(response);

                // Check if the login was successful
                if (response !== "failed") {
                    // Redirect to the "Show/Index" route
                    window.location.href = "/show";
                } else {
                    alert("Login failed. Please check your credentials.");
                }
            },
            error: function () {
                console.error("Error submitting login form.");
            }
        });
    });

});


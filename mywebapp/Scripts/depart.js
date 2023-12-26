$(document).ready(function () {
    // Attach click event to the button
    $("#addDepartmentBtn").click(function () {
        addDepartment();
    });

    // Function to add a new department to the table and database
    function addDepartment() {
        // Get form values
        var departName = $("#departName").val();
        var headOfDepartment = $("#headOfDepartment").val();
        var officeLocation = $("#officeLocation").val();

        // AJAX request to submit the form data
        $.ajax({
            type: "POST",
            url: "/Other/postdepart", // Replace with your actual backend API URL
            data: {
                departName: departName,
                headOfDepartment: headOfDepartment,
                officeLocation: officeLocation
            },
            success: function (response) {
                // Assuming the response contains the new department data
                console.log("Depart submited successfully");
            },
            error: function (error) {
                // Handle error
                console.error("Error submitting department:", error);
            }
        });
    }
    function populateTable() {
        var departmentTableBody = $("#departmentTableBody");

        // Make an AJAX request to fetch department data
        $.ajax({
            type: "GET",
            url: "/Other/GetDepartments", // Replace with your actual server endpoint
            dataType: "json",
            success: function (data) {
                // Clear existing rows from the table
                departmentTableBody.empty();
                console.log(data);
                // Loop through the department data and append rows to the table
                $.each(data, function (index, department) {
                    var row = $("<tr>").append(
                        $("<td>").text(department.DepartmentID),  // Corrected property name
                        $("<td>").text(department.DepartName),
                        $("<td>").text(department.HeadOfDepartment),
                        $("<td>").text(department.OfficeLocation),
                        
                    );

                    departmentTableBody.append(row);
                });
            },
            error: function (error) {
                console.error("Error fetching department data:", error);
            }
        });
    }

    populateTable();

});
function deleteDepartment(id) {
    // Make an AJAX request to delete the department
    $.ajax({
        type: "POST",
        url: "/Other/DeleteDepartment", // Replace with your actual server endpoint
        data: { departmentID: id },
        success: function (response) {
            // Assuming the server returns a success message or status
            console.log("Department deleted successfully");

            // Optionally, you can also remove the row from the table on the client side
            $("#departmentTableBody tr:has(td:contains('" + id + "'))").remove();
        },
        error: function (error) {
            console.error("Error deleting department:", error);
        }
    });
}

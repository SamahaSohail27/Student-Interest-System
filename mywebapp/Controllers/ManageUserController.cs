using mywebapp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Security;
using System.Xml.Linq;

namespace mywebapp.Controllers
{
    public class ManageUserController : Controller
    {
        // GET: ManageUser
        DataClasses1DataContext dab = new DataClasses1DataContext(db.conn);
        public ActionResult Index()
        {
            return View("Login");
        }
        public ActionResult ManageRegister()
        {
            // Redirect to the Register action
            return View("Register");
        }
        public ActionResult navigateRegister()
        {
            // Redirect to the Register action
            return RedirectToAction("Register");
        }

        public JsonResult GetRoles()
        {
            try
            {
                var roles = dab.roles.Select(r => new
                {
                    Id = r.id,
                    Name = r.name
                    // Add other properties as needed for the dropdown
                }).ToList();

                return Json(roles, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // Log the exception or print the details for debugging
                Console.WriteLine(ex.Message);
                throw; // Rethrow the exception for now
            }
        }


        public JsonResult AddUser(user us)
        {
            using (dab)
            {
                try
                {
                    // Create a new User object with the provided data
                    var newUser = new user
                    {
                        name = us.name,
                        email = us.email,
                        password = us.password,
                        phone_number = us.phone_number,
                        role_id = us.role_id,
                        registration_date = us.registration_date,
                        status_id = 3,
                        gender = us.gender,
                        address = us.address
                        // Set other properties
                    };

                    // Add the new user to the Users DbSet
                    dab.users.InsertOnSubmit(newUser);

                    // Save changes to the database
                    dab.SubmitChanges();
                    return Json("user submitted", JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    return Json("error user submitted", JsonRequestBehavior.AllowGet);

                }

            }
        }
        [HttpPost]
        public ActionResult Login(string email, string password)
        {
            var users = dab.users.ToList();
            foreach(user u in users)
            {
                if(u.email == email)
                {
                    if(u.password == password)
                    {
                        Session["UserId"] = u.id;
                        return Json(u.id, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            return Json("failed", JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetUserData()
        {
            // Check if the user is logged in
            if (Session["UserId"] == null)
            {
                // Return an error or redirect to the login page
                return Json("Unauthorized", JsonRequestBehavior.AllowGet);
            }

            int userId = (int)Session["UserId"];

            // Assuming you have a data access layer or service to retrieve user data
            var allUserData = dab.users.ToList(); // Retrieve all users
            var filteredUserData = new List<object>();

            // Filter the relevant data for each user
            foreach (var userData in allUserData)
            {
                var filteredData = new
                {
                    userid=userData.id,
                    UserName = userData.name,
                    UserEmail = userData.email,
                    PhoneNumber = userData.phone_number,
                    RegistrationDate = userData.registration_date,
                    RoleName = userData.role.name,
                    Gender = userData.gender,
                    Address = userData.address,
                    Status = userData.status.status_value // Assuming Status is a property in your User model
                };

                filteredUserData.Add(filteredData);
            }

            return Json(filteredUserData, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Indexm()
        {
            return View("Viewusers");
        }
        public JsonResult UpdateUserStatus(int userId, int statusId)
        {
            try
            {
                // Find the user by ID
                user userToUpdate = dab.users.FirstOrDefault(u => u.id == userId);
                status st=dab.status.FirstOrDefault(s => s.id == statusId);
                if (userToUpdate != null)
                {
                    // Update the user status
                    userToUpdate.status= st;
                    dab.SubmitChanges();

                    // You may want to save the changes to a database, but for this example, we'll just assume it's done
                    return Json("User status updated successfully");
                }

                return Json("User not found");
            }
            catch (Exception ex)
            {
                // Handle exceptions appropriately (log, show an error message, etc.)
                return Json("Error updating user status");
            }
        }

        // Other actions and methods in your controller
    }

}

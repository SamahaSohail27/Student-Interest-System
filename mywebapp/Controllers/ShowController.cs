using mywebapp.Models;
using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace mywebapp.Controllers
{
    public class ShowController : Controller
    {
        DataClasses1DataContext dab = new DataClasses1DataContext(db.conn);
       
        // GET: Show
        public JsonResult getadmin()
        {
            int? userId = HttpContext.Session["UserId"] as int?;
            if (userId != null)
            {
                return Json(check.checkadmin((int)userId), JsonRequestBehavior.AllowGet);
            }
            // Your logic to determine the boolean value
            bool booleanValue = false; // Replace this with your actual logic
            return Json(booleanValue, JsonRequestBehavior.AllowGet);

        }

        public ActionResult Index()
        {
            return View();
        }
        public JsonResult TotalPages()
        {
            try
            {
                var st = dab.Students.ToList().Count;
                var temp=  Json((int)Math.Ceiling((double)st / 10));
                return Json((int)Math.Ceiling((double)st / 10), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"Error in TotalPages method: {ex.Message}");

                // Return an error response
                Response.StatusCode = 500;
                return Json(new { error = "Internal Server Error" });
            }
        }

        public JsonResult filltable(int page , int pageSize )
        {
            try
            {
                var students = dab.Students.Skip((page - 1) * pageSize).Take(pageSize).ToList();
                List<stTable> stTables = new List<stTable>();

                foreach (Student st in students)
                {
                    stTables.Add(new stTable(st.StudentID, st.FullName, st.EmailAddress, st.Gender, st.DateOfBirth, st.City.CityName, st.Interest.InterestName, st.Degree.DegreeName));
                }

                return Json(stTables, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // Log the exception or return an error response
                Console.WriteLine("Error in filltable action: " + ex.Message);
                return Json(new { error = "An error occurred while processing the request." });
            }
        }
        public ActionResult GetStudentData(int id)
        {
          
            var student = dab.Students
                .Where(s => s.StudentID == id) // Assuming StudentID is the property representing the student's ID
                .Select(s => new
                {
                    s.FullName,
                    s.EmailAddress,
                    V = s.Gender.ToLower(),
                    s.DateOfBirth,
                    s.City.CityID,
                    s.Interest.InterestID,
                    s.Depart.DepartID,
                    s.Degree.DegreeID,
                    s.StartDate, s.EndDate,
                    s.Subject,s.RollNumber
                    
                })
                .FirstOrDefault();

            return Json(student);
        }
        public JsonResult Update(Student student)
        {
            int? userId = HttpContext.Session["UserId"] as int?;
            try
            {
                using (dab ) // Replace YourDataContext with your actual DataContext type
                {
                    // Step 1: Get the existing student from the database
                    Student existingStudent = dab.Students.SingleOrDefault(s => s.StudentID == student.StudentID);

                    if (existingStudent != null)
                    {
                        // Step 2: Update the properties of the existing student
                        existingStudent.FullName = student.FullName;
                        existingStudent.EmailAddress = student.EmailAddress;
                        existingStudent.Gender = student.Gender;
                        existingStudent.DateOfBirth = student.DateOfBirth;
                        existingStudent.CityID = student.CityID;
                        existingStudent.InterestID = student.InterestID;
                        existingStudent.DepartID = student.DepartID;
                        existingStudent.DegreeID = student.DegreeID;
                        existingStudent.StartDate = student.StartDate;
                        existingStudent.EndDate = student.EndDate;
                        existingStudent.RollNumber = student.RollNumber;
                        existingStudent.Subject = student.Subject;

                        // Set other properties as needed
                        DateTime currentDateTime = DateTime.Now;
                        activity_log ac = new activity_log
                        {

                            user_id = userId,
                            activity_id = 1,
                            timestamp = currentDateTime
                        };
                        dab.activity_logs.InsertOnSubmit(ac);
                        // Step 3: Submit changes to the database
                        dab.SubmitChanges();

                        return Json(new { Message = "Student updated successfully!" });
                    }
                    else
                    {
                        return Json(new { Error = "Student not found." });
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it accordingly
                return Json(new { Error = "An error occurred while updating the student." + ex.Message });
            }
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            try
            {
                using (dab)
                {
                    int? userId = HttpContext.Session["UserId"] as int?;
                    // Step 1: Get the existing student from the database
                    Student existingStudent = dab.Students.SingleOrDefault(s => s.StudentID == id);

                    if (existingStudent != null)
                    {
                        // Step 2: Remove the student from the Students collection
                        dab.Students.DeleteOnSubmit(existingStudent);
                        DateTime currentDateTime = DateTime.Now;
                        activity_log ac = new activity_log
                        {

                            user_id = userId,
                            activity_id = 1,
                            timestamp = currentDateTime
                        };
                        // Step 3: Submit changes to the database
                        dab.SubmitChanges();

                        return Json(new { Message = "Student deleted successfully!" });
                    }
                    else
                    {
                        return Json(new { Error = "Student not found." });
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it accordingly
                return Json(new { Error = "An error occurred while deleting the student." + ex.Message });
            }
        }


    }
}
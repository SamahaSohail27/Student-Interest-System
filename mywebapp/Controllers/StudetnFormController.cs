using Microsoft.Ajax.Utilities;
using mywebapp.Models;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace mywebapp.Controllers
{ 
    public class StudetnFormController : Controller
    {
        DataClasses1DataContext dab = new DataClasses1DataContext(db.conn);
        // GET: StudetnForm
        public ActionResult Index()
        {
            return View("form");
        }
        public JsonResult AddInterest(string interest)
        {
            try
            {
                using (dab)
                {
                    Interest newInterest = new Interest
                    {
                        InterestName = interest,
                        // Set other properties as needed
                    };

                    dab.Interests.InsertOnSubmit(newInterest);
                    dab.SubmitChanges();

                    // Return the new interest ID in the JSON response
                    return Json(new { InterestID = newInterest.InterestID, Message = "Interest created successfully!" });
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it accordingly
                return Json(new { Error = "An error occurred while creating the interest." + ex });
            }
        }


        public JsonResult GetCities()
        {

            ArrayList ls = new ArrayList();
            foreach (City d in dab.Cities)
            {
                ArrayList ml = new ArrayList();
                ml.Add(d.CityID);
                ml.Add(d.CityName);
                ls.Add(ml);
            }
            return Json(ls, JsonRequestBehavior.AllowGet);

        }
        public JsonResult Get_depart()
        {

            ArrayList ls = new ArrayList();
            foreach (Depart d in dab.Departs)
            {
                ArrayList ml = new ArrayList();
                ml.Add(d.DepartID);
                ml.Add(d.DepartName);
                ls.Add(ml);
            }
            return Json(ls, JsonRequestBehavior.AllowGet);

        }
        public JsonResult Get_Interest()
        {

            ArrayList ls = new ArrayList();
            foreach (Interest d in dab.Interests)
            {
                ArrayList ml = new ArrayList();
                ml.Add(d.InterestID);
                ml.Add(d.InterestName);
                ls.Add(ml);
            }

            return Json(ls, JsonRequestBehavior.AllowGet);

        }
       
        public JsonResult Get_Degree()
        {
            ArrayList ls = new ArrayList();
            foreach(Degree d in dab.Degrees)
            {
                ArrayList ml = new ArrayList();
                ml.Add(d.DegreeID);
                ml.Add(d.DegreeName);
                ls.Add(ml);
            }
           
            var dat = dab.Degrees.ToList();
            return Json(ls, JsonRequestBehavior.AllowGet);
        }

        public JsonResult PostStudent(Student student)
        {
            int? userId = HttpContext.Session["UserId"] as int?;
            try
            {
                if(student.InterestID == null) {
                }
                using (dab)
                {
                    // Step 2: Create a new Student object and set its properties
                    Student newStudent = new Student
                    {
                        FullName = student.FullName,
                        EmailAddress = student.EmailAddress,
                        Gender = student.Gender,
                        DateOfBirth = student.DateOfBirth,
                        CityID = student.CityID,
                        InterestID = student.InterestID,
                        DepartID = student.DepartID,
                        DegreeID = student.DegreeID,
                        StartDate=student.StartDate,
                        EndDate=student.EndDate,
                        RollNumber=student.RollNumber,
                        Subject=student.Subject

                        // Set other properties as needed
                    };
                    DateTime currentDateTime = DateTime.Now;
                    activity_log ac = new activity_log
                    {

                        user_id=userId,
                        activity_id=1,
                        timestamp=currentDateTime
                    };
                    dab.activity_logs.InsertOnSubmit(ac);

                    // Step 3: Add the Student object to the Students collection
                    dab.Students.InsertOnSubmit(newStudent);

                    // Step 4: Submit changes to the database
                    dab.SubmitChanges();
                }
                return Json(new { Message = "Student created successfully!" });
            }
            catch (Exception ex)
            {
                // Log the exception or handle it accordingly
                return Json(new { Error = "An error occurred while creating the student." + ex});
            }
        }
       

    }
   
}
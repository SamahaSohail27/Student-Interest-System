using mywebapp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace mywebapp.Controllers
{
    public class OtherController : Controller
    {
        DataClasses1DataContext dab = new DataClasses1DataContext(db.conn);
        // GET: Other
        public ActionResult Index()
        {
            return View("Departs");
        }
        public JsonResult postdepart(Depart depart)
        {
            try
            {
                Depart newdepart = new Depart
                {
                    DepartName = depart.DepartName,
                    HeadOfDepartment = depart.HeadOfDepartment,
                    OfficeLocation = depart.OfficeLocation,
                };
                dab.Departs.InsertOnSubmit(newdepart);
                dab.SubmitChanges();
                return Json("sucesss", JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                return Json(new { Error = "An error has occured while submitting depart" },JsonRequestBehavior.AllowGet);
            }
           

        }
        public JsonResult GetDepartments()
        {
            var departList = dab.Departs.ToList();

            var departmentData = departList.Select(depart => new
            {
                DepartmentID = depart.DepartID,
                DepartName = depart.DepartName,
                HeadOfDepartment = depart.HeadOfDepartment,
                OfficeLocation = depart.OfficeLocation
            }).ToList();

            return Json(departmentData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteDepartment(int departmentID)
        {
            try
            {
                // Your logic to delete the department by ID
                var departmentToDelete = dab.Departs.FirstOrDefault(d => d.DepartID == departmentID);

                if (departmentToDelete != null)
                {
                    dab.Departs.DeleteOnSubmit(departmentToDelete);
                    dab.SubmitChanges();

                    // Return a success message or status
                    return Json(new { success = true, message = "Department deleted successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Department not found" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while deleting the department" });
            }
        }

    }
}
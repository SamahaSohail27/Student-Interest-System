using mywebapp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace mywebapp.Controllers
{
    public class ManagementController : Controller
    {
        DataClasses1DataContext dab = new DataClasses1DataContext(db.conn);

        // GET: Management
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetProvinces()
        {
            try
            {
                // Use LINQ to fetch provinces from the database
                var provinces = dab.Provinces.Select(p => new
                {
                    ProvinceID = p.ProvinceID,
                    ProvinceName = p.ProvinceName
                }).ToList();

                // Return the list of provinces as JSON
                return Json(provinces, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"Error in GetProvinces method: {ex.Message}");

                // Return an error response
                Response.StatusCode = 500;
                return Json(new { error = "Internal Server Error" });
            }
        }
        public ActionResult AddProvince(string provinceName)
        {
            try
            {
                // Create a new Province object
                Province newProvince = new Province
                {
                    ProvinceName = provinceName
                    // Set other properties as needed
                };

                // Add the new Province to the DbContext
                dab.Provinces.InsertOnSubmit(newProvince);

                // Save changes to the database
                dab.SubmitChanges();

                // Return a success response
                return Json(new { Message = "Province added successfully!" });
            }
            catch (Exception ex)
            {
                // Log the exception or handle it accordingly
                return Json(new { Error = "An error occurred while adding the province." + ex.Message });
            }
        }
        public ActionResult AddCity(City city)
        {
            try
            {
                
                using (dab)
                {
                    // Add the city to the DbSet (assuming you have DbSet<City> Cities in your DbContext)
                    dab.Cities.InsertOnSubmit(city);

                    // Save changes to the database
                    dab.SubmitChanges();
                }

                // Return a success message
                return Json(new { Message = "City added successfully!" });
            }
            catch (Exception ex)
            {
                // Log the exception or handle it accordingly
                return Json(new { Error = "An error occurred while adding the city." + ex.Message });
            }
        }
        [HttpGet]
        public ActionResult GetCities()
        {
            // Use LINQ to fetch provinces from the database
            var cities = dab.Cities.Select(p => new
            {
                CityID = p.CityID,
                CityName = p.CityName,
                ProvinceName=p.Province.ProvinceName
            }).ToList();
            return Json(cities, JsonRequestBehavior.AllowGet);
        }

        // Action to get the list of provinces
        [HttpPost]
        public JsonResult DeleteCity(int id)
        {
            try
            {
                // Step 1: Get the existing city from the database
                City existingCity = dab.Cities.SingleOrDefault(c => c.CityID == id);

                if (existingCity != null)
                {
                    // Step 2: Remove the city from the Cities collection
                    dab.Cities.DeleteOnSubmit(existingCity);

                    // Step 3: Submit changes to the database
                    dab.SubmitChanges();

                    return Json(new { Message = "City deleted successfully!" });
                }
                else
                {
                    return Json(new { Error = "City not found." });
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it accordingly
                return Json(new { Error = "Error deleting city." });
            }
        }

        [HttpPost]
        public JsonResult DeleteProvince(int id)
        {
            try
            {
                // Step 1: Get the existing province from the database
                Province existingProvince = dab.Provinces.SingleOrDefault(p => p.ProvinceID == id);

                if (existingProvince != null)
                {
                    // Step 2: Remove the province from the Provinces collection
                    dab.Provinces.DeleteOnSubmit(existingProvince);

                    // Step 3: Submit changes to the database
                    dab.SubmitChanges();

                    return Json(new { Message = "Province deleted successfully!" });
                }
                else
                {
                    return Json(new { Error = "Province not found." });
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it accordingly
                return Json(new { Error = "Error deleting province." });
            }
        }


    }

}
using mywebapp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace mywebapp.Controllers
{
    public class ChartController : Controller
    {
        public class StudentStatusViewModel
        {
            public string Status { get; set; }
            public int StudentCount { get; set; }
        }

        // GET: Chart

        DataClasses1DataContext dab = new DataClasses1DataContext(db.conn);

        public ActionResult Index()
        {
            return View();
        }
        public JsonResult top5()
        {
            var topInterests = dab.Students
               .GroupBy(s => s.InterestID)
               .OrderByDescending(g => g.Count())
              .Take(5)
              .Select(g => g.Key)
                .Join(dab.Interests, interestId => interestId, interest => interest.InterestID, (interestId, interest) => interest.InterestName)
               .ToList();
            var bottomInterests = dab.Students
                .GroupBy(s => s.InterestID)
                 .OrderBy(g => g.Count())
                  .Take(5)
                   .Select(g => g.Key)
                        .Join(dab.Interests, interestId => interestId, interest => interest.InterestID, (interestId, interest) => interest.InterestName)
                      .ToList();
            return Json(new { TopInterests = topInterests, BottomInterests = bottomInterests }, JsonRequestBehavior.AllowGet);

        }
        public JsonResult total_interest()
        {
            return Json(dab.Interests.ToList().Count, JsonRequestBehavior.AllowGet);
        }
        public JsonResult age_distribution()
        {
            List<int?> ages = dab.Students
               .Select(student => CalculateAge(student.DateOfBirth))
               .ToList();
            return Json(ages, JsonRequestBehavior.AllowGet);

        }
        public JsonResult department_distribution()
        {
            var departmentData = dab.Students
     .GroupBy(s => s.DepartID)
     .Join(dab.Departs,
           studentGroup => studentGroup.Key,
           department => department.DepartID,
           (studentGroup, department) => new
           {
               DepartmentName = department.DepartName, // Assuming your Department table has a Name property
               StudentCount = studentGroup.Count()
           })
     .OrderByDescending(item => item.StudentCount)
     .Take(5) // Assuming you want the top 5 departments based on student count
     .ToList();

            // Convert the LINQ result to the desired format
            var pieChartData = new
            {
                labels = departmentData.Select(item => item.DepartmentName).ToArray(),
                values = departmentData.Select(item => item.StudentCount).ToArray()
            };

            // Return pieChartData to the client (e.g., serialize to JSON and send as an HTTP response)

            return Json(pieChartData, JsonRequestBehavior.AllowGet);
        }
        private static int? CalculateAge(DateTime dateOfBirth)
        {
            DateTime currentDate = DateTime.Now;
            int age = currentDate.Year - dateOfBirth.Year;

            // Check if the birthday has occurred this year
            if (currentDate < dateOfBirth.AddYears(age))
            {
                age--;
            }

            return age;
        }
        public JsonResult GetProvinceDistribution()
        {
            var provinceData = dab.Students
                .GroupBy(s => s.City.Province.ProvinceName)  // Assuming City and Province are navigation properties
                .Select(group => new
                {
                    ProvinceName = group.Key,
                    StudentCount = group.Count()
                })
                .OrderByDescending(item => item.StudentCount)
                .ToList();

            // Convert the LINQ result to the desired format
            var pieChartData = new
            {
                labels = provinceData.Select(item => item.ProvinceName).ToArray(),
                values = provinceData.Select(item => item.StudentCount).ToArray()
            };

            // Return pieChartData to the client (e.g., serialize to JSON and send as an HTTP response)
            return Json(pieChartData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDegreeDistribution()
        {
            // Get students from your data source (replace this with your actual data retrieval logic)
            var students = dab.Students.ToList();

            // Get degree distribution using LINQ
            var degreeDistribution = students
                .GroupBy(s => s.DegreeID)
                .Select(g => new
                {
                    DegreeID = g.Key,
                    DegreeName = g.First().Degree.DegreeName, // Assuming DegreeName is the same for a given DegreeID
                    StudentCount = g.Count()
                })
                .OrderByDescending(item => item.StudentCount)
                .Take(5)
                .ToList();

            // Convert the LINQ result to the desired format
            var chartData = new
            {
                labels = degreeDistribution.Select(item => item.DegreeName).ToArray(),
                values = degreeDistribution.Select(item => item.StudentCount).ToArray()
            };

            // Return chartData as a JSON result
            return Json(chartData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetGenderDistributionData()
        {
            // Get students from your data source (replace this with your actual data retrieval logic)
            var students = dab.Students.ToList();

            // Get gender distribution using LINQ
            var genderDistribution = students
                .GroupBy(s => s.Gender)
                .Select(g => new
                {
                    Gender = g.Key,
                    StudentCount = g.Count()
                })
                .ToList();

            // Convert the LINQ result to the desired format
            var chartData = new
            {
                labels = genderDistribution.Select(item => item.Gender).ToArray(),
                values = genderDistribution.Select(item => item.StudentCount).ToArray()
            };

            // Return chartData as a JSON result
            return Json(chartData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Gettabledata()
         {
            var studentStatusData = CalculateStudentStatusData();
            return Json(studentStatusData, JsonRequestBehavior.AllowGet);
        }

        private List<StudentStatusViewModel> CalculateStudentStatusData()
        {
            // Get students from your data source (replace this with your actual data retrieval logic)
            var students = dab.Students.ToList();

            // Calculate student status based on start and end dates compared to degree duration
            var studyingCount = students.Count(s => s.StartDate <= DateTime.Now && s.EndDate >= DateTime.Now);
            var enrolledCount = students.Count(s => s.StartDate > DateTime.Now);
            var aboutToGraduateCount = students.Count(s => s.EndDate < DateTime.Now && s.EndDate >= DateTime.Now.AddYears(-s.Degree.Duration));
            var graduatedCount = students.Count(s => s.EndDate < DateTime.Now.AddYears(-s.Degree.Duration));

            // Create a list of StudentStatusViewModel
            var studentStatusData = new List<StudentStatusViewModel>
        {
            new StudentStatusViewModel { Status = "Studying", StudentCount = studyingCount },
            new StudentStatusViewModel { Status = "Recently enrolled", StudentCount = enrolledCount },
            new StudentStatusViewModel { Status = "About to graduate", StudentCount = aboutToGraduateCount },
            new StudentStatusViewModel { Status = "Graduated", StudentCount = graduatedCount }
        };

            return studentStatusData;
        }
        public JsonResult GetSubmissiondata()
        {
            try
            {
                using ( dab) // Replace YourDbContext with your actual DbContext class
                {
                    // Replace 'YourTableName' with the actual name of your activity_log table
            var submissionData = dab.activity_logs
                .Where(log => log.activity_id == 1)
                .AsEnumerable() // Switch to LINQ to Objects
                .GroupBy(log => log.timestamp?.Date) // Use ?. to handle nullable DateTime
                .Select(group => new
                {
                    Date = group.Key?.ToString("yyyy-MM-dd"), // Extract date part only
                    Count = group.Count()
                })
                .OrderBy(item => item.Date)
                .ToList();

                    return Json(submissionData, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                return Json(new { Error = "Error fetching submission report data." });
            }
        }
        public JsonResult GetLast30DaysChartData()
        {
            DateTime thirtyDaysAgo = DateTime.Now.AddDays(-30);

            var last30DaysData = dab.activity_logs
                .Where(log => log.timestamp >= thirtyDaysAgo)
                 .AsEnumerable()
                .GroupBy(log => log.timestamp?.Date)
                .Select(group => new
                {
                    Date = group.Key?.ToString("yyyy-MM-dd"),
                    Count = group.Count()
                })
                .ToList();

            return Json(last30DaysData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLast24HoursChartData()
        {
            DateTime twentyFourHoursAgo = DateTime.Now.AddHours(-24);

            var last24HoursData = dab.activity_logs
                .Where(log => log.timestamp >= twentyFourHoursAgo)
                .AsEnumerable()
                .GroupBy(log => log.timestamp)
                .Select(group => new
                {
                    Date = group.Key?.ToString("yyyy-MM-dd HH:mm:ss"),
                    Count = group.Count()
                })
                .ToList();

            return Json(last24HoursData, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetMostActiveHoursData()
        {
            DateTime thirtyDaysAgo = DateTime.Now.AddDays(-30);

            var mostActiveHoursData = dab.activity_logs
                .Where(log => log.timestamp >= thirtyDaysAgo)
                .AsEnumerable()
                .GroupBy(log => log.timestamp?.Hour)
                .OrderByDescending(group => group.Count())
                .Take(5)
                .Select(group => new
                {
                    Hour = group.Key,
                    Count = group.Count()
                })
                .ToList();

            return Json(mostActiveHoursData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeastActiveHoursData()
        {
            DateTime thirtyDaysAgo = DateTime.Now.AddDays(-30);

            var leastActiveHoursData = dab.activity_logs
                .Where(log => log.timestamp >= thirtyDaysAgo)
                .AsEnumerable()
                .GroupBy(log => log.timestamp?.Hour)
                .OrderBy(group => group.Count())
                .Take(5)
                .Select(group => new
                {
                    Hour = group.Key,
                    Count = group.Count()
                })
                .ToList();

            return Json(leastActiveHoursData, JsonRequestBehavior.AllowGet);
        }

      


    }
}
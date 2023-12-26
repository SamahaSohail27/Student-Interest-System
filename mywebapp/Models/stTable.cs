using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace mywebapp.Models
{
    public class stTable
    {
        public int StudentID { get; set; }
        public string FullName { get; set; }
        public string EmailAddress { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string City { get; set; }
        public string Interest { get; set; }
        public string Degree { get; set; }

        public stTable(int studentID, string fullName, string emailAddress, string gender, DateTime dateOfBirth, string city, string interest, string degree)
        {
            StudentID = studentID;
            FullName = fullName;
            EmailAddress = emailAddress;
            Gender = gender;
            DateOfBirth = dateOfBirth;
            City = city;
            Interest = interest;
            Degree = degree;
        }
    }
}
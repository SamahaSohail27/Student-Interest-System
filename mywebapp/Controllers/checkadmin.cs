using mywebapp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace mywebapp.Controllers
{
    public class check
    {
     
        public static bool checkadmin(int userid)
        {
            DataClasses1DataContext dab = new DataClasses1DataContext(db.conn);
            user user = dab.users.FirstOrDefault(u => u.id == userid);
            if(user.role.id == 1)
            {
                return true;
            }
            return false;
        }
    }
}
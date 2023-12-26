using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace mywebapp
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.MapRoute(
                  name: "Register",
                  url: "Register",
                  defaults: new { controller = "ManageUser", action = "ManageRegister", id = UrlParameter.Optional }
              );


            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "ManageUser", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}

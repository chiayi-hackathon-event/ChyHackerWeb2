using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
    public class GetPartialViewController : Controller
    {
        // GET: GetPartialView
        public ActionResult getPartialView(string _path)
        {
            return PartialView(_path);
        }
    }
}
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MpaShell.Controllers
{
    [Route("/api")]
    [ApiController]
    public class Config (MpaShell.Config.App appConfig) : ControllerBase {

        [HttpGet("config")]
        public IActionResult Get() {
            //var config = new XShell.Mpa.Config.Configuration();


            return Ok(appConfig);
        }
    }
}

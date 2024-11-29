using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Sample1.Module2.Controllers
{
    [Route("/api")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet("test3")]
        public IActionResult Get() {
            return Ok(new string[] { "value5", "value6" });
        }
    }
}

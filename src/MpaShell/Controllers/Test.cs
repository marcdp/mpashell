﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MpaShell.Controllers {

    [Route("/api")]
    [ApiController]
    public class Test : ControllerBase
    {
        [HttpGet("test")]
        public IActionResult Get() {
            return Ok(new string[] { "testttttt", "value2" });
        }
    }
}

﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Sample1.Module1.Controllers
{
    [Route("/api")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet("test2")]
        public IActionResult Get() {
            return Ok(new string[] { "value3", "value4" });
        }
    }
}
using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// Purposely buggy controller to test for wrong requests
    /// </summary>
    public class BuggyController : BaseApiController
    {
        private ApplicationDbContext _context;

        public BuggyController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("notFound")]
        public IActionResult GetNotFoundRequest()
        {
            var thing = _context.Products.Find(999999);

            if (thing == null)
            {
                return NotFound(new ApiResponse(404));
            }

            return Ok();
        }

        [HttpGet("serverError")]
        public IActionResult GetServerError()
        {
            var thing = _context.Products.Find(999999);

            // thing will be null at this point
            var thingToReturn = thing.ToString();

            return Ok();
        }

        [HttpGet("badRequest")]
        public IActionResult GetBadRequest()
        {
            return BadRequest(new ApiResponse(400));
        }

        // To be used passing a string as parameter instead of the expected int
        [HttpGet("badRequest/{id}")]
        public IActionResult GetBadRequest(int id)
        {
            return BadRequest();
        }
    }
}

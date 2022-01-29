using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        [HttpGet]
        public string GetProducts()
        {
            return "";
        }

        [HttpGet("{id}")]
        public string GetProduct(int id)
        {
            return "";
        }
    }
}

using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using jsite.api.Data;
using Microsoft.AspNetCore.Authorization;

namespace jsite.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]

    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _repo;
        private readonly IMapper _mapper;
        public CategoryController(ICategoryRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }
        
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _repo.GetCategories();
            return Ok(categories);
        }

    }
}
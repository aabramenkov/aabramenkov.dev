using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using asite.api.Dtos;
using AutoMapper;
using jsite.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace asite.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class SnakeController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        public SnakeController(IMapper mapper, UserManager<User> userManager)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet("topsnakers")]
        [AllowAnonymous]
        public async Task<IActionResult> GetTopSnakers()
        {
            var userList = await _userManager.Users.OrderBy(u => u.SnakeScore).Take(5).ToListAsync();
            var usersToReturn = _mapper.Map<IEnumerable<UserForSnakeScoreDto>>(userList);

            return Ok(usersToReturn);
        }

        [HttpPost("updateScore")]
        [Authorize(Policy = "All")]
        public async Task<IActionResult> UpdateSnakeScore([FromQuery] int userId, [FromQuery] int score){
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId.ToString());
            user.SnakeScore = score;
            var result  = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest("failed to update user score");
            return Ok(); // new {id=userId, score=score}
        }
    }
}
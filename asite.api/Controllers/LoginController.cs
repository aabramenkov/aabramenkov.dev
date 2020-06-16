using System.Threading.Tasks;
using AutoMapper;
using jsite.api.Dtos;
using jsite.api.Helpers;
using jsite.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace jsite.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class LoginController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;
        private readonly SignInManager<User> _signInManager;
        public LoginController(IMapper mapper, UserManager<User> userManager, IConfiguration config, SignInManager<User> signInManager)
        {
            _signInManager = signInManager;
            _config = config;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _userManager.FindByEmailAsync(userForLoginDto.Email);
            
            if (user==null){
                return Unauthorized();
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);

            if (result.Succeeded)
            {
                string token = await AppTokens.GenerateJwtToken(user, _config, _userManager);
                var userForReturnDto = _mapper.Map<UserForReturnDto>(user);
                return Ok(new { token = token, user = userForReturnDto });
            }
            return Unauthorized();
        }

    }
}
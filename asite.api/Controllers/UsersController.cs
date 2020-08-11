using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using asite.api.Dtos;
using AutoMapper;
using jsite.api.Dtos;
using jsite.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace jsite.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public UsersController(IMapper mapper, UserManager<User> userManager)
        {
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Policy = "All")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var usersToReturn = _mapper.Map<IEnumerable<UserForReturnDto>>(users);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "All")]
        public async Task<IActionResult> GetUser(int id)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(id.ToString());

            var usersToReturn = _mapper.Map<UserForReturnDto>(user);

            return Ok(usersToReturn);
        }



        [HttpGet("usersWithRoles")]
        [Authorize(Policy = "All")]
        public async Task<IActionResult> GetUsersWithRoles(){
            var userList = await _userManager.Users
            .OrderBy(u=>u.UserName).ToListAsync();
            var userListForReturn = new List<UserForReturnDto>();

            foreach(var user in userList){
                var userForReturnDto =  _mapper.Map<UserForReturnDto>(user);
                userForReturnDto.Roles = await _userManager.GetRolesAsync(user);
                userListForReturn.Add(userForReturnDto);
            }
            return Ok(userListForReturn);
        }
        

        [HttpPost("editRoles/{userId}")]
        [Authorize(Policy = "AdminOrModerator")]
        public async Task<IActionResult> EditRoles(string userId, RoleEditDto roleEditDto){
            var user = await _userManager.FindByIdAsync(userId);
            var userRoles = await _userManager.GetRolesAsync(user);
            var selectedRoles = roleEditDto.RoleNames;
            selectedRoles = selectedRoles ?? new string[] {};
            
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if (!result.Succeeded)
            return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if (!result.Succeeded)
            return BadRequest("Failed to add to roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [HttpPost("{id}")]
        [Authorize(Policy = "All")]
        public async Task <IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto){
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(id.ToString());
            user.Email = userForUpdateDto.Email;
            user.UserName = userForUpdateDto.UserName;
            var result  = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest("failed to update user");
            return Ok(_mapper.Map<UserForReturnDto>(user));
        }


    }
}

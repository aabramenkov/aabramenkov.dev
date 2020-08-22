using System.Collections.Generic;
using System.Threading.Tasks;
using jsite.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Renju.HubConfig;
using Renju.Models;

namespace Renju.Controllers
{
    // [ServiceFilter(typeof(LogUserEnterSite))]
    [Route("api/{controller}")]
    [ApiController]
    public class RenjuController : ControllerBase
    {
        private readonly IConnectionManager _connectionManager;
        private readonly UserManager<User> _userManager;
        public RenjuController(IConnectionManager connectionManager, UserManager<User> userManager)
        {
            _userManager = userManager;
            _connectionManager = connectionManager;
        }

        [HttpGet("allgamers")]
        public async Task<IActionResult> AllGamers()
        {
            var gamers = new List<Gamer>();
            var connectedUserNameList = _connectionManager.OnlineUsers;
            foreach (var userName in connectedUserNameList)
            {
                User user = await _userManager.FindByNameAsync(userName);
                Gamer gamer = new Gamer() { UserName = user.UserName, PhotoUrl = user.PhotoUrl };
                gamers.Add(gamer);
            }

            return Ok(gamers);
        }
    }
}
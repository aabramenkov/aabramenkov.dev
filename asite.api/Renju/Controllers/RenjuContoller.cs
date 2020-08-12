using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Renju.HubConfig;

namespace Renju.Controllers
{
    // [ServiceFilter(typeof(LogUserEnterSite))]
    [Route("api/{controller}")]
    [ApiController]
    public class RenjuController : ControllerBase
    {
        private readonly IConnectionManager _connectionManager;
        public RenjuController(IConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        // [AllowAnonymous]
        // [HttpGet("gamers")]
        // public async Task<IActionResult> Gamers()
        // {
        //     IEnumerable<string> gamers = new List<string>();
        //     await Task.Run(() => gamers =_connectionManager.OnlineUsers);
        //     return Ok(gamers);
        // }

        // [AllowAnonymous]
        // [HttpGet]
        // public async Task<IActionResult> RegisterUser()
        // {
        //     IEnumerable<Gamer> gamers = new List<Gamer>();
        //     await Task.Run(() => {gamers = ActiveUsersService.GetActiveGamers();});
        //     return Ok(gamers);
        // }

        [AllowAnonymous]
        [HttpGet("allgamers")]
        public async Task<IActionResult> AllGamers()
        {
            IEnumerable<string> gamers = new List<string>();
            await Task.Run(() => gamers =_connectionManager.OnlineUsers);
            return Ok(gamers);
        }

        
    }
}
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Renju.HubConfig;

namespace Renju
{
    [ServiceFilter(typeof(LogUserEnterSite))]
    [Route("api/{controller}")]
    [ApiController]
    public class RenjuController : ControllerBase
    {
        private readonly IConnectionManager _connectionManager;
        public RenjuController(IConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        [HttpGet]
        public async Task<IActionResult> RegisterUser()
        {
            await Task.Run(() => { });
            return Ok(ActiveUsersService.GetActiveGamers());
        }
        
        [HttpGet("gamers")]
        public async Task<IActionResult> Gamers()
        {
            IEnumerable<string> gamers = new List<string>();
            await Task.Run(() => gamers =_connectionManager.OnlineUsers);
            return Ok(gamers);
        }
    }
}
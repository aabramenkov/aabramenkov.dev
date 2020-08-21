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

        [HttpGet("allgamers")]
        public async Task<IActionResult> AllGamers()
        {
            IEnumerable<string> gamers = new List<string>();
            await Task.Run(() => gamers =_connectionManager.OnlineUsers);
            return Ok(gamers);
        }
    }
}
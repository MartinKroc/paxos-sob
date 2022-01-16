using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Paxos_Server.DataStorage;
using Paxos_Server.HubConfig;

namespace Paxos_Server.Controllers
{
    [Route("api/role")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IHubContext<DataHub> _context;
        private Random random = new Random();

        public RoleController(IHubContext<DataHub> context)
        {
            _context = context;
        }
        
        [HttpPost]
        [Route("leader-wannabe/{id:int}")]
        public IActionResult WantToBeALeader(int id)
        {
            var server = DataManager.GetData().Servers.FirstOrDefault(x => x.ServerId == id);
            if (server == null)
                return BadRequest("No server with such id!");

            server.WannabeLeader = true;
            return Ok();
        }

        [HttpPatch]
        [Route("random-leader")]
        public IActionResult GetRandomLeader()
        {
            if (DataManager.LeaderExists())
            {
                return BadRequest("Leader already exists!");
            }
            var servers = DataManager.GetData().Servers;
            var newLeader = servers[random.Next(servers.Count)];
            newLeader.ChangeServerRole(ServerRole.Leader);
            
            return Ok(newLeader);
        }
    }
}
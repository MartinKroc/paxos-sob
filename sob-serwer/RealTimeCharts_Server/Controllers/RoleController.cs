using System;
using Microsoft.AspNetCore.Mvc;
using Paxos_Server.DataStorage;

namespace Paxos_Server.Controllers
{
    
    public class RoleController : ControllerBase
    {
         private Random random = new Random();
        //POST zgłoszenie że chce być lederem
        //

        [HttpPatch]
        [Route("random-leader")]
        public IActionResult GetRandomLeader()
        {
            var servers = DataManager.GetData().Servers;
            var newLeader = servers[random.Next(servers.Count)];
            newLeader.ChangeServerRole(ServerRole.Leader);
            
            return Ok(newLeader);
        }
    }
}
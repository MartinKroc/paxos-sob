using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Paxos_Server.DataStorage;
using Paxos_Server.HubConfig;
using Paxos_Server.Models;
using Paxos_Server.TimerFeatures;

namespace Paxos_Server.Controllers
{
    [Route("api/servers")]
    [ApiController]
    public class ServerController : ControllerBase
    {
        private IHubContext<DataHub> _hub; 

        public ServerController(IHubContext<DataHub> hub) 
        { 
            _hub = hub;
        }

        public IActionResult Get()
        { 
            var timerManager = new TimerManager(() => 
                _hub.Clients.All.SendAsync("transferserversdata", DataManager.GetData()));
            var serversList = DataManager.GetData().Servers;
            return Ok(serversList); 
        }

        [HttpPost]
        [Route("destroy/{id}")]
        public async Task<IActionResult> LeaderDegradation(int id)
        {
            var servers = DataManager.GetData().Servers;
            var toDestroy = servers.FirstOrDefault(x => x.ServerId == id);
            if (toDestroy == null)
            {
                    return BadRequest("No server with this id found!");
            }

            if (toDestroy.Role == ServerRole.Leader)
            {
                
                await _hub.Clients.All.SendAsync("broadcastleaderdestroyedmessage",
                    $"Leader destroyed!");
            }
            
            servers.Remove(toDestroy);
            return Ok();
        }

        [HttpGet]
        [Route("leaders-to-be")]
        public IActionResult GetVotableServers()
        {
            var servers = DataManager.GetData().Servers.Where(x => x.WannabeLeader == true);
            return Ok(servers);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Paxos_Server.DataStorage;
using Paxos_Server.HubConfig;
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
            /*var timerManager = new TimerManager(() => 
                _hub.Clients.All.SendAsync("transferserversdata", DataManager.GetData()));*/
            var serversList = DataManager.GetData().Servers;
            return Ok(serversList); 
        }
    }
}
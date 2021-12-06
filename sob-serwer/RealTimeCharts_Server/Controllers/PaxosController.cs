﻿using System;
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
    [Route("api/servs")]
    [ApiController]
    public class PaxosController : ControllerBase
    {
        public IActionResult Get()
        {
            DataManager.AddServer();
            
            return Ok(new { Message = "adding Completed" }); 
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;
using Paxos_Server.DataStorage;
using Paxos_Server.HubConfig;
using Paxos_Server.Models;
using Paxos_Server.TimerFeatures;

namespace Paxos_Server.Controllers
{
    [Route("api/servs")]
    [ApiController]
    public class PaxosController : ControllerBase
    {
        [HttpPost]
        [Route("add")]
        public IActionResult AddServerClient()
        {
            return Ok(DataManager.AddServer(ServerRole.Client)); 
        }

        [HttpPost]
        [Route("vote")]
        public IActionResult AddVote([FromBody] Vote vote)
        {
            var votingData = DataManager.GetVotingData();
            var serverVoting = votingData.Votes.FirstOrDefault(x => x.ServerId == vote.ServerId);

            if (!DataManager.GetData().Servers.Any(x => x.ServerId == vote.ServerId) 
                && !DataManager.GetData().Servers.Any(x => x.ServerId == vote.Value))
            {
                return BadRequest($"No server registered with such id!");
            }
            if(serverVoting != null)
            {
                return BadRequest("Server already gave its vote!");
            }
            DataManager.AddVote(vote);

            if (DataManager.AreAllVoteCollected())
            {
                //broadcast voting results
                //change winner to leader
            }
            return Ok("Vote saved!");
        }

        [HttpGet]
        [Route("votes")]
        public IActionResult GetVotes()
        {
            var votes = DataManager.GetVotingData().Votes;
            return Ok(votes);
        }

        [HttpGet]
        [Route("voting-result")]
        public IActionResult GetVotingResults()
        {
            if (!DataManager.AreAllVoteCollected())
            {
                return BadRequest("Voting is not over!");
            }

            int value, count;

            (value, count) = DataManager.VotingResult();

            return Ok($"Wins server {value} with {count} votes!");
        }
    }
}
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
        private readonly IHubContext<DataHub> _context;

        public PaxosController(IHubContext<DataHub> context)
        {
            _context = context;
        }

        [HttpPost]
        [Route("add")]
        public IActionResult AddServerClient()
        {
            return Ok(DataManager.AddServer(ServerRole.Client));
        }

        [HttpPost]
        [Route("vote")]
        public async Task<IActionResult> AddVote([FromBody] Vote vote)
        {
            if (!DataManager.IsVotingActive())
            {
                return BadRequest("Voting is not open!");
            }
            
            var votingData = DataManager.GetVotingData();
            var serverVoting = votingData.Votes.FirstOrDefault(x => x.ServerId == vote.ServerId);

            
            // jeśli któryś nie istnieje, głos nie może zostać oddany
            if (DataManager.GetData().Servers.All(x => x.ServerId != vote.ServerId) 
                || DataManager.GetData().Servers.All(x => x.ServerId != vote.Value))
            {
                return BadRequest($"No server registered with such id!");
            }
            
            if(DataManager.GetData().Servers.First(x => x.ServerId == vote.ServerId).Role != ServerRole.Client)
            {
                return BadRequest($"You are not a client! Cannot vote!");
            }
            
            if(!DataManager.GetData().Servers.First(x => x.ServerId == vote.Value).WantToBeLeader())
            {
                return BadRequest($"Server with this id do not want to be a leader!");
            }

            if (serverVoting != null)
            {
                return BadRequest("Server already gave its vote!");
            }

            DataManager.AddVote(vote);

            await _context.Clients.All.SendAsync("broadcastnewvotemessage",
                $"New vote!\nServer {vote.ServerId} votes for {vote.Value}");
            
            if (!DataManager.AreAllVoteCollected()) return Ok("Vote saved!");

            var (winnerId, count) = DataManager.VotingResult();

            await _context.Clients.All.SendAsync("broadcastwinnermessage",
                $"Voting is over!\nWins server {winnerId} with {count} votes!");

            DataManager.EndVoting();
            
            var winner = DataManager.GetData().Servers.First(x => x.ServerId == winnerId);
            winner.ChangeServerRole(ServerRole.Leader);

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
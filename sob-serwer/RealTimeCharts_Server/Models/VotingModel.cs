using System.Collections.Generic;

namespace Paxos_Server.Models
{
    public class VotingModel
    {
        public List<Vote> Votes { get; set; }

        public VotingModel()
        {
            Votes = new List<Vote>();
        }
    }
}
using System.Collections.Generic;

namespace Paxos_Server.Models
{
    public class Server
    {
        public int ServerId { get; set; }
        public ServerRole Role { get; set; }
        public bool IsWorking { get; set; } 

        public Server(int id, ServerRole role)
        {
            ServerId = id;
            Role = role;
            IsWorking = true;
        }

        public void ChangeServerRole(ServerRole role)
        {
            Role = role;
        }

        public bool WantToBeLeader()
        {
            return Role == ServerRole.Proposer;
        }
        
        public bool DoNotWantToBeLeader()
        {
            return Role == ServerRole.Client;
        }

        public void StopWorking()
        {
            IsWorking = false;
        }
    }
}

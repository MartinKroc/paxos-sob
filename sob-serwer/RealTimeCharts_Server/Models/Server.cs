using System.Collections.Generic;

namespace Paxos_Server.Models
{
    public class Server
    {
        public int ServerId { get; set; }
        public ServerRole Role { get; set; }
        public bool WannabeLeader { get; set; }

        public Server(int id, ServerRole role)
        {
            ServerId = id;
            Role = role;
            WannabeLeader = false;
        }

        public void ChangeServerRole(ServerRole role)
        {
            Role = role;
        }

        public bool WantToBeLeader()
        {
            return WannabeLeader;
        }
    }
}

using System.Collections.Generic;

namespace Paxos_Server.Models
{
    public class Server
    {
        public int ServerId { get; set; }
        public ServerRole Role { get; set; }

        public Server(int id, ServerRole role)
        {
            ServerId = id;
            Role = role;
        }

        public void ChangeServerRole(ServerRole role)
        {
            Role = role;
        }
    }
}

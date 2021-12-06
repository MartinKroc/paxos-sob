using System.Collections.Generic;

namespace Paxos_Server.Models
{
    public class ServerModel
    {
        public List<Server> Servers { get; set; }

        public ServerModel()
        {
            Servers = new List<Server>();
        }
    }
}

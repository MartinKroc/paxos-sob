using System.Collections.Generic;

namespace Paxos_Server.Models
{
    public class Server
    {
        public int ServerId { get; set; }

        public Server(int id)
        {
            ServerId = id;
        }
    }
}

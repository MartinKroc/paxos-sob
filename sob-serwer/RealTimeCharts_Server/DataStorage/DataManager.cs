using Paxos_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Paxos_Server.DataStorage
{
    public static class DataManager
    {
        public static ServerModel sm = new ServerModel();
        public static ServerModel GetData()
        {
            return sm;
        }

        public static Server AddServer(ServerRole role)
        {
            var r = new Random();
            var newServer = new Server(r.Next(1, 40), role);
            sm.Servers.Add(newServer);
            return newServer;
        }

        public static bool LeaderExists()
        {
            var avaliableServers = GetData().Servers;
            var leader = avaliableServers.FirstOrDefault(x => x.Role == ServerRole.Leader);
            return leader != null;
        }
    }
}

using Paxos_Server.Models;
using System;
using System.Collections.Generic;

namespace Paxos_Server.DataStorage
{
    public static class DataManager
    {
        public static ServerModel sm = new ServerModel();
        public static ServerModel GetData()
        {
            return sm;
        }

        public static ServerModel AddServer(ServerRole role)
        {
            var r = new Random();
            sm.Servers.Add(new Server(r.Next(1, 40), role));
            return sm;
        }
    }
}

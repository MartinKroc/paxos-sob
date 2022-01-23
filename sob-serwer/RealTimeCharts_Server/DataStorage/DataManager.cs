using Paxos_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Paxos_Server.DataStorage
{
    public static class DataManager
    {
        private static readonly ServerModel Sm = new ServerModel();
        private static readonly VotingModel Vm = new VotingModel();
        private static bool VotingActive { get; set; }
        public static ServerModel GetData()
        {
            return Sm;
        }

        public static VotingModel GetVotingData()
        {
            return Vm;
        }

        public static Server AddServer(ServerRole role)
        {
            if (!Sm.Servers.Any())
            {
                StartNewVoting();
            }
            var r = new Random();
            var id = r.Next(1, 40);
            while (Sm.Servers.Any(x => x.ServerId == id))
            {
                id = r.Next(1, 40);
            }
            var newServer = new Server(id, role);
            Sm.Servers.Add(newServer);
            return newServer;
        }

        public static bool LeaderExists()
        {
            var availableServers = GetData().Servers;
            var leader = availableServers.FirstOrDefault(x => x.Role == ServerRole.Leader);
            return leader != null;
        }

        public static void AddVote(Vote vote)
        {
            Vm.Votes.Add(vote);
            var server = Sm.Servers.FirstOrDefault(x => x.ServerId == vote.ServerId);
            server?.ChangeServerRole(ServerRole.Acceptor);
        }

        public static bool AreAllVoteCollected()
        {
            //przy oddaniu głosu staje się akseptatorem
            //koniec głosowania jak nie ma już klientów
            var serverClientCount = Sm.Servers.Count(x => x.Role == ServerRole.Client);
            return serverClientCount == 0;
        }

        public static (int,int) VotingResult()
        {
            var votes = Vm.Votes;
            var votesValues = votes.Select(v => v.Value).ToList();
            var g = votesValues.GroupBy( i => i );
            var maxVoteCount = 0;
            var maxVoteValue = 0;
            foreach( var grp in g )
            {
                //Console.WriteLine( "{0} {1}", grp.Key, grp.Count() );
                if (maxVoteCount >= grp.Count()) continue;
                maxVoteCount = grp.Count();
                maxVoteValue = grp.Key;
            }
            EraseVotes();
            return (maxVoteValue, maxVoteCount);
        }

        private static void EraseVotes()
        {
            Vm.Votes.Clear();
            var toClients = Sm.Servers.Where(x => x.Role == ServerRole.Acceptor);
            foreach (var server in toClients)
            {
                server.Role = ServerRole.Client;
            }
        }

        public static Server GetCurrentLeader()
        {
            var availableServers = GetData().Servers;
            var leader = availableServers.FirstOrDefault(x => x.Role == ServerRole.Leader);
            return leader;
        }

        public static void StartNewVoting()
        {
            VotingActive = true;
        }
        public static void EndVoting()
        {
            VotingActive = false;
        }

        public static bool IsVotingActive()
        {
            return VotingActive;
        }
    }
}

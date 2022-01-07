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
            var r = new Random();
            var newServer = new Server(r.Next(1, 40), role);
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
        }

        public static bool AreAllVoteCollected()
        {
            var voteCount = Vm.Votes.Count();
            var serverClientCount = Sm.Servers.Count(x => x.Role == ServerRole.Client);
            return voteCount == serverClientCount;
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
        }
    }
}

using Xunit;
using Paxos_Server;
using Paxos_Server.DataStorage;
using Paxos_Server.Models;

namespace PaxosTests
{
    public class UnitTest1
    {
        [Fact]
        public void AddClient()
        {
            var newClient = DataManager.AddServer(ServerRole.Client);
            Assert.NotNull(newClient);
            Assert.True(newClient.ServerId > 0);
            Assert.Equal(ServerRole.Client, newClient.Role);
            Helper.Clean();
        }

        [Fact]
        public void RoleChange()
        {
            var server = DataManager.AddServer(ServerRole.Client);
            server.ChangeServerRole(ServerRole.Acceptor);
            Assert.Equal(ServerRole.Acceptor, server.Role);
            Helper.Clean();
        }

        [Fact]
        public void CurrentLeader()
        {
            var server = DataManager.AddServer(ServerRole.Leader);
            Assert.Equal(ServerRole.Leader, server.Role);
            Assert.Equal(server, DataManager.GetCurrentLeader());
            Helper.Clean();
        }

        [Fact]
        public void StopWorking()
        {
            var server = DataManager.AddServer(ServerRole.Client);
            server.StopWorking();
            Assert.False(server.IsWorking);
            Helper.Clean();
        }

        [Fact]
        public void AddVote()
        {
            var server = DataManager.AddServer(ServerRole.Client);
            var vote = new Vote()
            {
                ServerId = server.ServerId,
                Value = 12
            };
            DataManager.AddVote(vote);
            Assert.Equal(ServerRole.Acceptor, server.Role);
            Assert.Contains(vote, DataManager.GetVotingData().Votes);
            Helper.Clean();
        }

        [Fact]
        public void VotingActiveManagement()
        {
            Assert.False(DataManager.IsVotingActive());
            DataManager.AddServer(ServerRole.Client);
            Assert.True(DataManager.IsVotingActive());
            DataManager.EndVoting();
            Assert.False(DataManager.IsVotingActive());
            
            Helper.Clean();
        }

        [Fact]
        public void VotingResult()
        {
            DataManager.AddVote(new Vote { ServerId = 1, Value = 2 });
            DataManager.AddVote(new Vote { ServerId = 2, Value = 1 });
            DataManager.AddVote(new Vote { ServerId = 3, Value = 1 });
            DataManager.AddVote(new Vote { ServerId = 4, Value = 2 });
            DataManager.AddVote(new Vote { ServerId = 5, Value = 2 });
            DataManager.AddVote(new Vote { ServerId = 6, Value = 2 });

            var (value, count) = DataManager.VotingResult();
            
            Assert.Equal(2, value);
            Assert.Equal(4, count);
            
            Assert.Empty(DataManager.GetVotingData().Votes);
            Helper.Clean();
        }

        [Fact]
        public void LeaderExists()
        {
            Assert.False(DataManager.LeaderExists());
            DataManager.AddServer(ServerRole.Leader);
            Assert.True(DataManager.LeaderExists());
            Helper.Clean();
        }
    }
}
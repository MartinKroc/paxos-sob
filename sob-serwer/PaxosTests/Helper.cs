using Paxos_Server.DataStorage;

namespace PaxosTests
{
    public class Helper
    {
        public static void Clean()
        {
            var x = DataManager.GetData().Servers;
            DataManager.GetData().Servers.Clear();
            DataManager.EndVoting();
        }
    }
}
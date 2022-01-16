using Microsoft.AspNetCore.SignalR;
using Paxos_Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Paxos_Server.HubConfig
{
    public class DataHub : Hub
    {
        public async Task BroadcastServersData(ServerModel data) => await Clients.All.SendAsync("broadcastserversdata", data);

        //public async Task BroadcastWinner(Server winner) => await Clients.All.SendAsync("broadcastwinner", winner);
        
        [HubMethodName("SendWinnerNotificatnion")]
        public Task SendNotification(string message)
        {
            var that = this;
            
            return Clients.All.SendAsync("broadcastwinnermessage", message);
        }
    }
}

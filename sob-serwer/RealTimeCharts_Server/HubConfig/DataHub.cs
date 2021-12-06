using Microsoft.AspNetCore.SignalR;
using Paxos_Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Paxos_Server.HubConfig
{
    public class DataHub : Hub
    {
        public async Task BroadcastServersData(ServerModel data) => await Clients.All.SendAsync("broadcastserversdata", data);
    }
}

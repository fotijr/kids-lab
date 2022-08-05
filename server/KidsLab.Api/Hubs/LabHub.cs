using KidsLab.Data;
using Microsoft.AspNetCore.SignalR;

namespace KidsLab.Api.Hubs
{
   

    public class LabHub : Hub
    {
        public LabHub()
        {
        }

        public async Task Update(DataUpdate update) =>
            await Clients.All.SendAsync("updateReceived", update);

        public async Task RequestGroupControl(string groupId)
        {
            var requestor = this.Context.UserIdentifier;
            var connection = this.Context.ConnectionId;
            await Clients.All.SendAsync("groupControlRequested", groupId, requestor, connection);
        }

        public async Task GrantGroupControl(string groupId, string connection, Guid user)
        {
            await Clients.AllExcept(connection).SendAsync("groupControlRescinded", groupId);
            await Clients.User(user.ToString()).SendAsync("groupControlGranted", groupId);
        }
    }
}


using KidsLab.Data;
using Microsoft.AspNetCore.SignalR;

namespace KidsLab.Api.Hubs
{
    public class LabHub : Hub
    {
        private const string ControlRoomGroup = "SiteBuilder";
        private readonly InMemoryData _db;

        public LabHub(InMemoryData db)
        {
            _db = db;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            _db.HubConnections.Add(Context.ConnectionId);
            await BroadcastUserCountsAsync();
        }

        private async Task BroadcastUserCountsAsync()
        {
            var users = _db.Users.Count;
            await Clients.All.SendAsync("updateReceived", new DataUpdate
            {
                Device = "users",
                Value = users.ToString()
            });

            if (users > 0)
            {
                var age = Math.Round(_db.Users.Average(u => u.Age), 1);
                await Clients.All.SendAsync("updateReceived", new DataUpdate
                {
                    Device = "age",
                    Value = age.ToString()
                });
            }
            
            await Clients.All.SendAsync("updateReceived", new DataUpdate
            {
                Device = "lab-users",
                Value = _db.HubConnections.Count.ToString()
            });
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _db.HubConnections.Remove(Context.ConnectionId);
            await BroadcastUserCountsAsync();
            await base.OnDisconnectedAsync(exception);
        }

        public async Task Update(DataUpdate update) =>
            await Clients.All.SendAsync("updateReceived", update);

        public Task RegisterControlRoom(string token)
        {
            // TODO: verify token before adding to control room group
            return this.Groups.AddToGroupAsync(this.Context.ConnectionId, ControlRoomGroup);
        }

        public async Task DeviceInputCommand(string groupId, string value)
        {
            await Clients.Group(ControlRoomGroup).SendAsync("CommandDevice", groupId, value);
        }

        public async Task RequestInputApprovalControl(string groupId, string value)
        {
            var requestor = this.Context.UserIdentifier;
            if (requestor == null)
            {
                // no user, ignore request
                return;
            }
            var connection = this.Context.ConnectionId;
            var user = _db.GetUser(Guid.Parse(requestor));
            await Clients.All.SendAsync("inputApprovalRequested", groupId, value, requestor, connection, user?.Name);
        }

        public async Task RequestGroupControl(string groupId)
        {
            var requestor = this.Context.UserIdentifier;
            if (requestor == null)
            {
                // no user, ignore request
                return;
            }
            var connection = this.Context.ConnectionId;
            var user = _db.GetUser(Guid.Parse(requestor));
            await Clients.All.SendAsync("groupControlRequested", groupId, requestor, connection, user?.Name);
        }

        public async Task GrantGroupControl(string groupId, string connection, Guid user)
        {
            await Clients.AllExcept(connection).SendAsync("groupControlRescinded", groupId);
            await Clients.User(user.ToString()).SendAsync("groupControlGranted", groupId);
        }
    }
}


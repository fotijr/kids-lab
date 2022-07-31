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
    }
}


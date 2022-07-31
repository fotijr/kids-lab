using System;
using KidsLab.Data;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;

namespace KidsLab.ControlRoom;


public class DataUpdateService
{
    private HubConnection _connection;

    public DataUpdateService()
    {
        _connection = BuildHubConnection();

        // TODO: setup client methods called from server here
        // _connection.On<Guid, string>("StartSession", this.GetSiteEditorAsync);
    }

    public async Task Initialize()
    {
        await ConnectToHub();
    }

    /// <summary>
    /// Send data update to all clients
    /// </summary>
    /// <param name="update"></param>
    /// <returns></returns>
    public async Task SendUpdate(DataUpdate update)
    {
        await _connection.InvokeAsync("Update", update);
    }

    private HubConnection BuildHubConnection()
    {
        var hubConnection = new HubConnectionBuilder()
            .WithUrl("http://localhost:5036/lab")
            .AddMessagePackProtocol()
            .Build();

        hubConnection.Closed += async (error) =>
        {
            Console.WriteLine($"Connection closed: {error?.Message}");
            await Task.Delay(new Random().Next(0, 5) * 1000);
            await ConnectToHub();
        };
        return hubConnection;
    }

    private async Task ConnectToHub()
    {
        await _connection.StartAsync();
        Console.WriteLine("Connected to hub.");
    }
}


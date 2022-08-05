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
    public async Task<bool> SendUpdate(DataUpdate update)
    {
        try
        {
            await _connection.InvokeAsync("Update", update);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Send failed: {ex.Message}");
            return false;
        }
    }

    private HubConnection BuildHubConnection()
    {
        var local = "http://localhost:5036/hubs/lab";
        var prod = "https://kids-lab.fotijr.com/api/hubs/lab";
        var hubConnection = new HubConnectionBuilder()
            .WithUrl(local)
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


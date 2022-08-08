using System;
using CliWrap;
using KidsLab.Data;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;

namespace KidsLab.ControlRoom;


public class DataUpdateService
{
    private HubConnection _connection;
    private SerialController _serial;
    private readonly ChromecastController _chromecast;

    public DataUpdateService()
    {
        _chromecast = new ChromecastController();
        _serial = new SerialController();
        _connection = BuildHubConnection();
    }

    public async Task Initialize()
    {
        await Task.WhenAll(
             ConnectToHub(),
             _chromecast.Initialize(),
            _serial.Initialize()
        );
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

        hubConnection.On<string, string>("CommandDevice", this.ProcessCommand);
        return hubConnection;
    }

    private async Task ProcessCommand(string groupId, string value)
    {
        Console.WriteLine($"Command for {groupId}, value ${value}.");
        switch (groupId)
        {
            case "say":
                // say text
                await Cli.Wrap("say")
                     .WithValidation(CommandResultValidation.None)
                     .WithArguments(a => a
                         .Add(value)
                     )
                    .ExecuteAsync();
                break;
            case "sounds":
                // play sounds
                await SoundController.PlayAsync(value);
                break;
            case "gifs":
                // new gif for projector selected
                await _chromecast.PlayGifAsync(value);
                break;
            default:
                Console.WriteLine($"Command NOT handled: Group {groupId}, value ${value}.");
                break;
        }

    }

    private async Task ConnectToHub()
    {
        await _connection.StartAsync();
        Console.WriteLine("Connected to hub.");
        await _connection.InvokeAsync("RegisterControlRoom", "TODO: use security token here");
    }
}


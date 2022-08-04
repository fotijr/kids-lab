using KidsLab.ControlRoom;

Console.WriteLine("Starting up the Control Room...");

var updater = new DataUpdateService();
var chromecast = new ChromecastController();

await Task.WhenAll(updater.Initialize(), chromecast.Initialize());

while (true)
{
    var time = DateTime.Now.ToLongTimeString();
    Console.WriteLine($"Hello at {time}");
    await updater.SendUpdate(new KidsLab.Data.DataUpdate { Device = "Time", Value = time });
    await Task.Delay(3000);
}

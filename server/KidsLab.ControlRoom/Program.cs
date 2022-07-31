// See https://aka.ms/new-console-template for more information



using KidsLab.ControlRoom;

Console.WriteLine("Starting up the Control Room...");

var updater = new DataUpdateService();
await updater.Initialize();

while (true)
{
    var time = DateTime.Now.ToLongTimeString();
    Console.WriteLine($"Hello at {time}");
    await updater.SendUpdate(new KidsLab.Data.DataUpdate { Device = "Time", Value = time });
    await Task.Delay(2000);
}

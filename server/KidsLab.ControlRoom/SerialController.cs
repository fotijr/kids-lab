using System;
using System.IO.Ports;

namespace KidsLab.ControlRoom
{
    /// <summary>
    /// Communicate with hardware devices over USB serial
    /// </summary>
    public class SerialController
    {
        List<SerialDevice> Devices;

        public SerialController()
        {
            Devices = new();
        }

        public async Task Initialize()
        {
            var portNames = SerialPort.GetPortNames();
            foreach (var port in portNames)
            {
                try
                {
                   var device = new SerialDevice(port);
                    if (await device.IsKidsLabHardware())
                    {
                        Console.WriteLine($"Found device {device.Name}!");
                        Devices.Add(device);
                    }
                    else
                    {
                        // close port if it opened
                        device.Dispose();
                    }
                }
                catch (Exception ex)
                {
                    // unable to connect to a Kids Lab device
                    Console.WriteLine($"Serial device failed: {ex.Message}");
                }
            }
            Console.WriteLine($"Connected to {Devices.Count} from {portNames.Length} ports.");
            if (Devices.Count == 0)
            {
                Console.WriteLine("🤷🤷🤷 no ports connected 🤷🤷🤷");
            }
        }
    }
}


using System;
using System.IO.Ports;

namespace KidsLab.ControlRoom
{
    public class SerialDevice : IDisposable
    {

        private SerialPort _serialPort;
        private string _portName;
        private const int _baudRate = 9600; // 115200;
        private string _serialInput = "";
        public string Name { get; private set; }
        public List<string> MessagesReceived { get; set; }

        public SerialDevice(string portName)
        {
            Name = "";
            _portName = portName;
            _serialPort = new SerialPort(portName);
            this.MessagesReceived = new List<string>();
        }

        public async Task<bool> IsKidsLabHardware()
        {
            var open = await OpenAsync();
            if (!open)
            {
                Console.WriteLine($"Port {_portName} failed to open.");
            }
            SendMessage("KL?");
            var waitUntil = DateTime.Now.AddMilliseconds(10000);
            while (DateTime.Now < waitUntil)
            {
                if (!string.IsNullOrWhiteSpace(this.Name))
                {
                    return true;
                }
                await Task.Delay(200);
            }
            return false;
        }

        public async Task<bool> OpenAsync()
        {
            try
            {
                _serialPort.BaudRate = _baudRate;
                // _serialPort.Parity = Parity.None;
                // _serialPort.StopBits = StopBits.One;
                // _serialPort.DataBits = 8;
                // _serialPort.Handshake = Handshake.None;
                _serialPort.ReadTimeout = 1500;
                _serialPort.WriteTimeout = 1500;
                // _serialPort.RtsEnable = false;
                // _serialPort.Handshake = Handshake.None;
                _serialPort.DataReceived += new SerialDataReceivedEventHandler(MessageReceived);
                _serialPort.Open();
                var waitUntil = DateTime.Now.AddMilliseconds(5000);
                while (DateTime.Now < waitUntil)
                {
                    if (_serialPort.IsOpen)
                    {
                        _serialPort.DiscardInBuffer();
                        return true;
                    }
                    Console.WriteLine("Waiting...");
                    await Task.Delay(200);
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Port {_portName} failed to open.");
                Close();
                throw;
            }

        }

        public void Close()
        {
            if (_serialPort.IsOpen) _serialPort.Close();
        }

        public void Dispose()
        {
            Close();
        }

        public void SendMessage(string message)
        {
            if (!_serialPort.IsOpen) return;
            _serialPort.Write(message);
        }

        /// <summary>`
        /// Processes data received from the serial port
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        // private void MessageReceived(object sender, SerialDataReceivedEventArgs e)
        private void MessageReceived(object sender, EventArgs e)
        {
            try
            {
                SerialPort sp = (SerialPort)sender;
                string response = "";
                char current;
                _serialInput += sp.ReadExisting();
                Console.WriteLine($"Read {_serialInput}");

                var toRemove = new Dictionary<int, int>();
                var starting = 0;
                int substringLength;
                for (int i = 0; i < _serialInput.Length; i++)
                {
                    current = _serialInput[i];
                    if (Environment.NewLine.Contains(current))
                    {
                        // don't try to process string if it's consecutive new line characters
                        if (i > starting)
                        {
                            substringLength = (i - starting);
                            response = _serialInput.Substring(starting, substringLength);
                            ProcessSerialMessage(response);
                            toRemove.Add(starting, substringLength);
                        }
                        starting = i + 1;
                    }
                }
                foreach (var item in toRemove)
                {
                    _serialInput = _serialInput.Remove(item.Key, item.Value);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing serial! {ex.Message}");
            }
        }

        private void ProcessSerialMessage(string message)
        {
            var parts = message.Split('|');
            if (parts.Length < 3) return;
            var category = parts[1];
            switch (category)
            {
                case "!":
                    // device responding to identity challenge, save name
                    Name = parts[2];
                    break;
                case "ENV":
                    // enviornment sensor readings
                    var humidity = parts[2];
                    var temperature = parts[3];
                    break;
                case "MOT":
                    // motion sensor readings
                    var acceleration = new ThreeDimensionValue(parts[2], parts[3], parts[4]);
                    var gyro = new ThreeDimensionValue(parts[5], parts[6], parts[7]);
                    var magnetic = new ThreeDimensionValue(parts[8], parts[9], parts[10]);
                    break;
                default:
                    Console.WriteLine("Serial message not processed: " + message);
                    break;
            }
        }
    }

    public class ThreeDimensionValue
    {
        public float X { get; set; }
        public float Y { get; set; }
        public float Z { get; set; }

        public ThreeDimensionValue(string x, string y, string z)
        {
            X = float.Parse(x);
            Y = float.Parse(y);
            Z = float.Parse(z);
        }
    }
}


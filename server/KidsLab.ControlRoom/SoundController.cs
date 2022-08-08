using System;
using System.IO.Ports;
using CliWrap;
using LibVLCSharp.Shared;

namespace KidsLab.ControlRoom
{
    /// <summary>
    /// Communicate with hardware devices over USB serial
    /// </summary>
    public class SoundController
    {
        /// <summary>
        /// Root directory of files to play
        /// </summary>
        static readonly string FilesRoot = "/Users/dominic/Documents";

        public static async Task PlayAsync(string file)
        {
            try
            {
                var path = Path.Combine(FilesRoot, file);
                Console.WriteLine(path);
                await Cli.Wrap("afplay")
                     .WithValidation(CommandResultValidation.None)
                     .WithArguments(a => a
                         .Add(path)
                     )
                    .ExecuteAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to play file. {ex.Message}");
            }
        }
    }
}


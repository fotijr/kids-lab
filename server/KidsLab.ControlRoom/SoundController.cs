using System;
using System.IO.Ports;
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
        static readonly string FilesRoot = "/path";

        public static void Play(string file)
        {
            try
            {
                using var libvlc = new LibVLC(enableDebugLogs: true);
                using var media = new Media(libvlc, new Uri(Path.Combine(FilesRoot, file)));
                using var mediaplayer = new MediaPlayer(media);

                mediaplayer.Play();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to play file. {ex.Message}");
            }
        }
    }
}


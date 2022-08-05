using System;
using Sharpcaster;

namespace KidsLab.ControlRoom
{
    public class ChromecastController
    {
        private ChromecastClient _client = new();

        public async Task Initialize()
        {
            try
            {
                Console.WriteLine("Looking for Chromecasts...");
                var locator = new MdnsChromecastLocator();
                var chromecasts = await locator.FindReceiversAsync();

                Console.WriteLine($"Found {chromecasts.Count()} Chromecasts.");
                var chromecast = chromecasts.FirstOrDefault();
                if (chromecast == null)
                {
                    Console.WriteLine("🚧 No Chromecast found! 🚧");
                    return;
                }
                await _client.ConnectChromecast(chromecast);
                await _client.LaunchApplicationAsync("B3419EF5");
                var backgroundTask = RotateGifsAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Failed to connect to Chromecasts ❌");
            }            
        }

        private async Task RotateGifsAsync()
        {
            var fireworks = "https://media.giphy.com/media/YLishCv852mWucndDf/giphy.gif";
            var mickeyWhistle = "https://media.giphy.com/media/cIxxFKOTCPwX9DUk7L/giphy.gif";
            var mickeyDonaldSwinging = "https://media.giphy.com/media/3Hz6PIHppEkquEiSBt/giphy.gif";
            var dancingGroot = "https://sciencefiction.com/wp-content/uploads/2017/04/dancing-baby-groot.gif";
            var gifs = new string[] {
                fireworks, mickeyWhistle, mickeyDonaldSwinging, dancingGroot
            };
            var gifIndex = 0;

            while (true)
            {
                var media = new Sharpcaster.Models.Media.Media
                {
                    ContentUrl = gifs[gifIndex]
                };
                await _client.GetChannel<Sharpcaster.Interfaces.IMediaChannel>().LoadAsync(media);
                gifIndex++;
                if (gifIndex >= gifs.Length)
                {
                    gifIndex = 0;
                }
                await Task.Delay(15000);


            }
        }
    }
}


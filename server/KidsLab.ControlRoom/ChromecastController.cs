using System;
using Sharpcaster;

namespace KidsLab.ControlRoom
{
    public class ChromecastController
    {
        private ChromecastClient _client = new();
        private Dictionary<string, string> gifs = new()
        {
            ["fireworks"] = "https://media.giphy.com/media/YLishCv852mWucndDf/giphy.gif",
            ["happy"] = "https://media.giphy.com/media/cIxxFKOTCPwX9DUk7L/giphy.gif",
            ["friends"] = "https://media.giphy.com/media/3Hz6PIHppEkquEiSBt/giphy.gif",
            ["groot"] = "https://sciencefiction.com/wp-content/uploads/2017/04/dancing-baby-groot.gif"
        };

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
                await PlayGifAsync("happy");
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Failed to connect to Chromecasts ❌");
            }
        }

        public async Task PlayGifAsync(string id)
        {
            if (gifs.TryGetValue(id, out var url))
            {
                await PlayUrlAsync(url);
            }
        }

        private async Task PlayUrlAsync(string url)
        {
            var media = new Sharpcaster.Models.Media.Media
            {
                ContentUrl = url
            };
            await _client.GetChannel<Sharpcaster.Interfaces.IMediaChannel>().LoadAsync(media);
        }
    }
}


using KidsLab.Api;
using KidsLab.Api.Hubs;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services
    .AddSignalR()
    .AddMessagePackProtocol();

// Add Cookie authentication, so users can "sign in" and we can remember them
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
    .AddCookie(options =>
    {
        // Chrome needs this flag to include the cookie in API requests after login
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.LoginPath = "";
        options.Events.OnRedirectToLogin = (context) =>
        {
            // prevent API from redirecting when API fails for authentication
            context.Response.Headers["Location"] = context.RedirectUri;
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });


// Add CORS, so we can connect to API from different servers
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "prod",
                      policy =>
                      {
                          policy
                            .WithOrigins("https://kids-lab.fotijr.com")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials()
                            .SetPreflightMaxAge(TimeSpan.FromSeconds(1800));
                      });
    options.AddPolicy(name: "dev",
                      policy =>
                      {
                          policy
                            .SetIsOriginAllowed(origin => true)
                            .WithOrigins("https://localhost:5173")
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials()
                            .SetPreflightMaxAge(TimeSpan.FromSeconds(1800));
                      });
});

builder.Services.AddSingleton(new InMemoryData());
var app = builder.Build();

var corsPolicy = app.Environment.IsDevelopment() ? "dev" : "prod";
app.UseCors(corsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<LabHub>("/hubs/lab");

app.Run();


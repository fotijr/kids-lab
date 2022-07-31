using KidsLab.Api.Hubs;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services
    .AddSignalR()
    .AddMessagePackProtocol();

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

var app = builder.Build();

var corsPolicy = app.Environment.IsDevelopment() ? "dev" : "prod";
app.UseCors(corsPolicy);

app.UseAuthorization();

app.MapControllers();

app.MapHub<LabHub>("/lab");

app.Run();


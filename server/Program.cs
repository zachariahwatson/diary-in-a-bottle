using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//use the postgres db
builder.Services.AddDbContextPool<AppDbContext>(opt => 
    opt.UseNpgsql(builder.Configuration.GetConnectionString("WebApiDatabase")));

builder.Services.AddDbContextPool<AuthDbContext>(opt => 
    opt.UseNpgsql(builder.Configuration.GetConnectionString("WebApiDatabase")));

//add auth to the dependency injection container
builder.Services.AddAuthorization();

//activate the identity api endpoints
builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<AuthDbContext>();

var app = builder.Build();

//map the identity api endpoints
app.MapCustomIdentityApi<IdentityUser>();

using var scope = app.Services.CreateScope();
//migrate app
await using var appDbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
await appDbContext.Database.MigrateAsync();
//migrate auth
await using var authDbContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
await authDbContext.Database.MigrateAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using EPortalApi.Data;

// Fix for Npgsql 6.0+ DateTime issues
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(opts => {
        opts.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EPortalApi", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"] ?? "SuperSecretKeyForEMunicipalPortalApi_PleaseChangeInProduction!";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// CORS must allow any origin for local dev
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// CORS MUST be first before any auth middleware
app.UseCors("AllowAll");

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.Headers["Access-Control-Allow-Origin"] = "*";
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var ex = exceptionHandlerPathFeature?.Error;
        var errorMsg = ex?.Message ?? "Internal Server Error";
        if (ex?.InnerException != null) errorMsg += " | Inner: " + ex.InnerException.Message;
        await context.Response.WriteAsync($"{{\"error\":\"{errorMsg}\"}}");
    });
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Auto-migrate database on startup + seed admin
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        dbContext.Database.Migrate();

        // --- DB SEEDING (Reset logic removed to preserve data) ---


        // --- DONE ---

        // Seed default admin
        if (!dbContext.AdminUsers.Any())
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hash = Convert.ToBase64String(sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes("Admin@1234")));
            dbContext.AdminUsers.Add(new EPortalApi.Models.AdminUser
            {
                Name = "Super Admin",
                Email = "admin@emunicipal.com",
                PasswordHash = hash,
                Role = "Admin"
            });
            dbContext.SaveChanges();
            Console.WriteLine("✅ Default admin seeded: admin@emunicipal.com / Admin@1234");
        }

        // Seed Utility Services if missing
        var utilityServices = new[] { "Property Tax", "Water", "Electricity" };
        foreach (var name in utilityServices)
        {
            if (!dbContext.Services.Any(s => s.SName == name))
            {
                dbContext.Services.Add(new EPortalApi.Models.Service { SName = name, Rate = 0, DNo = null });
                Console.WriteLine($"✅ Seeded Utility Service: {name}");
            }
        }

        // Ensure citizen 'abc' has complete data for the demo
        var citizenAbc = dbContext.Citizens.FirstOrDefault(c => c.Name == "abc");
        if (citizenAbc != null && string.IsNullOrEmpty(citizenAbc.Phno))
        {
            citizenAbc.Phno = "+91 9876543210";
            citizenAbc.Gender = "Male";
            citizenAbc.Bday = "1995-05-15";
            citizenAbc.House_no = "C-42";
            citizenAbc.Street_no_name = "Golden Street, Pune";
            Console.WriteLine("✅ Populated sample data for citizen 'abc'");
        }
        
        dbContext.SaveChanges();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️  DB startup: {ex.Message}");
    }
}

app.Run();


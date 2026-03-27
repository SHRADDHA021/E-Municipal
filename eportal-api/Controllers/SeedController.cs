using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EPortalApi.Data;
using EPortalApi.Models;
using System.Security.Cryptography;
using System.Text;

namespace EPortalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SeedController(ApplicationDbContext context) { _context = context; }

        [HttpGet("init")]
        public async Task<IActionResult> Init()
        {
            try
            {
                // Ensure Database Created
                await _context.Database.MigrateAsync();

                // 1. Seed Admin
                if (!await _context.AdminUsers.AnyAsync(a => a.Email == "admin@emunicipal.com"))
                {
                    _context.AdminUsers.Add(new AdminUser
                    {
                        Name = "Super Admin",
                        Email = "admin@emunicipal.com",
                        PasswordHash = HashPassword("Admin@1234"),
                        Role = "Admin"
                    });
                }

                // 2. Seed Citizen
                if (!await _context.Citizens.AnyAsync(c => c.Email == "citizen@emunicipal.com"))
                {
                    _context.Citizens.Add(new Citizen
                    {
                        Name = "Jane Citizen",
                        Email = "citizen@emunicipal.com",
                        PasswordHash = HashPassword("Cit@1234"),
                        Phno = "9876543210"
                    });
                }

                // 3. Seed Department & Employee
                var dept = await _context.Departments.FirstOrDefaultAsync(d => d.DName == "General Administration");
                if (dept == null)
                {
                    dept = new Department { DName = "General Administration" };
                    _context.Departments.Add(dept);
                    await _context.SaveChangesAsync();
                }

                if (!await _context.Employees.AnyAsync(e => e.Email == "employee@emunicipal.com"))
                {
                    _context.Employees.Add(new Employee
                    {
                        EName = "John Employee",
                        Email = "employee@emunicipal.com",
                        PasswordHash = HashPassword("Emp@1234"),
                        DNo = dept.DNo,
                        Phno = "1234567890",
                        Salary = 25000
                    });
                }

                // 4. Seed Services (Property Tax, Water, Electricity)
                string[] utlties = { "Property Tax", "Water", "Electricity" };
                foreach (var s in utlties)
                {
                    if (!await _context.Services.AnyAsync(svc => svc.SName == s))
                    {
                        _context.Services.Add(new Service { SName = s, Rate = 500, RequiredDocs = "ConsumerID/PropertyID" });
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "✅ Database seeded successfully!", credentials = new { admin = "admin@emunicipal.com / Admin@1234", citizen = "citizen@emunicipal.com / Cit@1234", employee = "employee@emunicipal.com / Emp@1234" } });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message, detail = ex.InnerException?.Message });
            }
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            return Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
        }
    }
}

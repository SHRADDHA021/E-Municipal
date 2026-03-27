using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using EPortalApi.Data;
using EPortalApi.DTOs;
using EPortalApi.Models;

namespace EPortalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST /api/auth/register  (citizen only)
        [HttpPost("register")]
        public async Task<IActionResult> RegisterCitizen([FromBody] CitizenRegisterDto dto)
        {
            if (await _context.Citizens.AnyAsync(c => c.Email == dto.Email))
                return BadRequest("Email already exists");

            var citizen = new Citizen
            {
                Name = dto.Name,
                Email = dto.Email,
                Gender = dto.Gender,
                Bday = dto.Bday,
                Phno = dto.Phno,
                House_no = dto.House_no,
                Street_no_name = dto.Street_no_name,
                PasswordHash = Hash(dto.Password)
            };

            _context.Citizens.Add(citizen);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Citizen registered successfully" });
        }

        // POST /api/auth/login  (Citizen | Admin | Employee)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            string role = dto.Role;
            string name = "";
            int userId = 0;

            if (role == "Citizen")
            {
                var citizen = await _context.Citizens.FirstOrDefaultAsync(c => c.Email == dto.Email);
                if (citizen == null || !Verify(dto.Password, citizen.PasswordHash))
                    return Unauthorized("Invalid credentials");
                name = citizen.Name;
                userId = citizen.IDNo;
            }
            else if (role == "Admin")
            {
                var admin = await _context.AdminUsers.FirstOrDefaultAsync(a => a.Email == dto.Email);
                if (admin == null || !Verify(dto.Password, admin.PasswordHash))
                    return Unauthorized("Invalid credentials");
                name = admin.Name;
                userId = admin.Id;
            }
            else if (role == "Employee")
            {
                var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Email == dto.Email);
                if (emp == null || !Verify(dto.Password, emp.PasswordHash))
                    return Unauthorized("Invalid credentials");
                name = emp.EName;
                userId = emp.EID;
            }
            else
            {
                return BadRequest("Invalid role");
            }

            var token = GenerateJwtToken(userId, name, dto.Email, role);
            return Ok(new LoginResponseDto { Token = token, Role = role, Name = name, UserId = userId });
        }

        // POST /api/auth/register-employee (Admin only)
        [HttpPost("register-employee")]
        public async Task<IActionResult> RegisterEmployee([FromBody] EmployeeRegisterDto dto)
        {
            if (await _context.Employees.AnyAsync(e => e.Email == dto.Email))
                return BadRequest("Email already exists");

            var employee = new Employee
            {
                EName = dto.EName,
                Email = dto.Email,
                DNo = dto.DNo,
                Phno = dto.Phno,
                EAdd = dto.EAdd,
                Salary = dto.Salary,
                PasswordHash = Hash(dto.Password)
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Employee registered successfully", employee });
        }

        private static string Hash(string password)
            => Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(password)));

        private static bool Verify(string password, string hash)
            => Hash(password) == hash;

        private string GenerateJwtToken(int userId, string name, string email, string role)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                new(ClaimTypes.Email, email),
                new(ClaimTypes.Name, name),
                new(ClaimTypes.Role, role)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

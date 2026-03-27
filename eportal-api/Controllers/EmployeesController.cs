using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using EPortalApi.Data;
using EPortalApi.DTOs;
using EPortalApi.Models;

namespace EPortalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public EmployeesController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var emps = await _context.Employees
                .Include(e => e.Department)
                .Select(e => new {
                    e.EID, e.EName, e.Email, e.Phno, e.EAdd, e.Salary, e.DNo,
                    Department = e.Department == null ? null : new { e.Department.DNo, e.Department.DName }
                })
                .ToListAsync();
            return Ok(emps);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> GetOne(int id)
        {
            var emp = await _context.Employees
                .Include(e => e.Department)
                .FirstOrDefaultAsync(e => e.EID == id);
            if (emp == null) return NotFound();
            return Ok(new { emp.EID, emp.EName, emp.Email, emp.Phno, emp.EAdd, emp.Salary, emp.DNo, emp.Department });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] EmployeeRegisterDto dto)
        {
            if (await _context.Employees.AnyAsync(e => e.Email == dto.Email))
                return BadRequest("Email already exists");

            var emp = new Employee
            {
                EName = dto.EName,
                Email = dto.Email,
                DNo = dto.DNo,
                Phno = dto.Phno,
                EAdd = dto.EAdd,
                Salary = dto.Salary,
                PasswordHash = Convert.ToBase64String(
                    System.Security.Cryptography.SHA256.HashData(
                        System.Text.Encoding.UTF8.GetBytes(dto.Password)))
            };
            _context.Employees.Add(emp);
            await _context.SaveChangesAsync();
            return Ok(new { emp.EID, emp.EName, emp.Email, emp.DNo, emp.Phno, emp.EAdd });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeRegisterDto dto)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return NotFound();
            emp.EName = dto.EName;
            emp.Email = dto.Email;
            emp.DNo = dto.DNo;
            emp.Phno = dto.Phno;
            emp.EAdd = dto.EAdd;
            emp.Salary = dto.Salary;
            if (!string.IsNullOrEmpty(dto.Password))
                emp.PasswordHash = Convert.ToBase64String(
                    System.Security.Cryptography.SHA256.HashData(
                        System.Text.Encoding.UTF8.GetBytes(dto.Password)));
            await _context.SaveChangesAsync();
            return Ok(new { emp.EID, emp.EName, emp.Email, emp.DNo, emp.Phno, emp.EAdd, emp.Salary });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return NotFound();
            _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Me - for Employee portal
        [HttpGet("me")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> Me()
        {
            var eid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var emp = await _context.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.EID == eid);
            if (emp == null) return NotFound();
            return Ok(new { emp.EID, emp.EName, emp.Email, emp.Phno, emp.DNo, emp.Department });
        }
    }
}

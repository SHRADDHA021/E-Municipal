using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EPortalApi.Data;
using EPortalApi.DTOs;
using EPortalApi.Models;

namespace EPortalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DepartmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public DepartmentsController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var depts = await _context.Departments
                .Include(d => d.Employees)
                .Include(d => d.Services)
                .ToListAsync();
            return Ok(depts);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOne(int id)
        {
            var dept = await _context.Departments
                .Include(d => d.Employees)
                .Include(d => d.Services)
                .FirstOrDefaultAsync(d => d.DNo == id);
            if (dept == null) return NotFound();
            return Ok(dept);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] DepartmentCreateDto dto)
        {
            var dept = new Department { DName = dto.DName };
            _context.Departments.Add(dept);
            await _context.SaveChangesAsync();
            return Ok(dept);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] DepartmentCreateDto dto)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null) return NotFound();
            dept.DName = dto.DName;
            await _context.SaveChangesAsync();
            return Ok(dept);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var dept = await _context.Departments
                .Include(d => d.Employees)
                .Include(d => d.Services)
                    .ThenInclude(s => s.ServiceRequests)
                .Include(d => d.Complaints)
                .FirstOrDefaultAsync(d => d.DNo == id);

            if (dept == null) return NotFound();

            // Cascade delete associations manually to ensure success
            if (dept.Employees.Any()) _context.Employee.RemoveRange(dept.Employees);
            
            foreach (var svc in dept.Services)
            {
                if (svc.ServiceRequests.Any()) _context.ServiceRequests.RemoveRange(svc.ServiceRequests);
            }
            if (dept.Services.Any()) _context.Services.RemoveRange(dept.Services);
            
            if (dept.Complaints.Any()) _context.Complaints.RemoveRange(dept.Complaints);

            _context.Departments.Remove(dept);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

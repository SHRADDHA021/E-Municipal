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
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ServicesController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var services = await _context.Services
                .Include(s => s.Department)
                .Select(s => new { 
                    s.SID, 
                    s.SName, 
                    s.Rate, 
                    s.DNo, 
                    s.RequiredDocs, 
                    Department = s.Department == null ? null : new { s.Department.DNo, s.Department.DName } 
                })
                .ToListAsync();
            return Ok(services);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ServiceCreateDto dto)
        {
            var svc = new Service { SName = dto.SName, Rate = dto.Rate, DNo = dto.DNo, RequiredDocs = dto.RequiredDocs };
            _context.Services.Add(svc);
            await _context.SaveChangesAsync();
            return Ok(svc);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ServiceCreateDto dto)
        {
            var svc = await _context.Services.FindAsync(id);
            if (svc == null) return NotFound();
            svc.SName = dto.SName;
            svc.Rate = dto.Rate;
            svc.DNo = dto.DNo;
            svc.RequiredDocs = dto.RequiredDocs;
            await _context.SaveChangesAsync();
            return Ok(svc);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var svc = await _context.Services.FindAsync(id);
            if (svc == null) return NotFound();
            _context.Services.Remove(svc);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

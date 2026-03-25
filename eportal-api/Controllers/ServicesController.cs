using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using EPortalApi.Data;
using EPortalApi.Models;

namespace EPortalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetServices()
        {
            return Ok(await _context.Services.ToListAsync());
        }

        [HttpPost("apply/{serviceId}")]
        [Authorize(Roles = "Citizen")]
        public async Task<IActionResult> Apply(int serviceId)
        {
            var service = await _context.Services.FindAsync(serviceId);
            if (service == null) return NotFound("Service not found");

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var application = new Application
            {
                UserId = userId,
                ServiceId = serviceId
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(application);
        }

        [HttpGet("applications")]
        public async Task<IActionResult> GetApplications()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            IQueryable<Application> query = _context.Applications.Include(a => a.Service);

            if (role == "Citizen")
            {
                query = query.Where(a => a.UserId == userId);
            }
            else
            {
                query = query.Include(a => a.User);
            }

            return Ok(await query.ToListAsync());
        }

        [HttpPut("applications/{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] string status)
        {
            var application = await _context.Applications.FindAsync(id);
            if (application == null) return NotFound();

            application.Status = status;
            await _context.SaveChangesAsync();

            return Ok(application);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EPortalApi.Data;

namespace EPortalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalCitizens = await _context.Users.CountAsync(u => u.Role == "Citizen");
            var pendingComplaintsCount = await _context.Complaints.CountAsync(c => c.Status == "Pending");
            var completedComplaintsCount = await _context.Complaints.CountAsync(c => c.Status == "Completed");
            var totalRevenue = await _context.Payments.SumAsync(p => p.Amount);

            var citizensList = await _context.Users
                .Where(u => u.Role == "Citizen")
                .Select(u => new { u.Id, u.Name, u.Email, u.Phone })
                .ToListAsync();

            var pendingComplaintsList = await _context.Complaints
                .Where(c => c.Status == "Pending")
                .Select(c => new { c.Id, c.Title, c.Description, CitizenName = c.User.Name })
                .ToListAsync();

            return Ok(new
            {
                TotalCitizens = totalCitizens,
                PendingComplaints = pendingComplaintsCount,
                CompletedComplaints = completedComplaintsCount,
                TotalRevenue = totalRevenue,
                CitizensList = citizensList,
                PendingComplaintsList = pendingComplaintsList
            });
        }
    }
}

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
            var pendingComplaints = await _context.Complaints.CountAsync(c => c.Status == "Pending");
            var completedComplaints = await _context.Complaints.CountAsync(c => c.Status == "Completed");
            var totalRevenue = await _context.Payments.SumAsync(p => p.Amount);

            return Ok(new
            {
                TotalCitizens = totalCitizens,
                PendingComplaints = pendingComplaints,
                CompletedComplaints = completedComplaints,
                TotalRevenue = totalRevenue
            });
        }
    }
}

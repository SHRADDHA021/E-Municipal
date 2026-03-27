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
    public class FeedbacksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public FeedbacksController(ApplicationDbContext context) { _context = context; }

        [HttpGet("community")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCommunityFeedbacks()
        {
            var list = await _context.Feedbacks
                .Include(f => f.Citizen)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new {
                    f.FID, f.Subject, f.Message, f.Rating, f.CreatedAt,
                    CitizenName = f.Citizen != null ? f.Citizen.Name : "Anonymous"
                })
                .Take(10)
                .ToListAsync();
            return Ok(list);
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Citizen,Employee")]
        public async Task<IActionResult> GetAll()
        {
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
            var uidStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine($"🔍 Feedbacks.GetAll: Role={role}, UID={uidStr}");

            var list = await _context.Feedbacks
                .Include(f => f.Citizen)
                .Include(f => f.Complaint)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
            return Ok(list);
        }

        [HttpGet("mine")]
        [Authorize(Roles = "Citizen")]
        public async Task<IActionResult> GetMine()
        {
            var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var list = await _context.Feedbacks
                .Where(f => f.IDNo == uid)
                .Include(f => f.Complaint)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        [Authorize(Roles = "Citizen")]
        public async Task<IActionResult> Create([FromBody] FeedbackCreateDto dto)
        {
            var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var fb = new Feedback
            {
                IDNo = uid,
                CID = dto.CID,
                Subject = dto.Subject,
                Message = dto.Message,
                Rating = dto.Rating,
                IsCompleted = dto.IsCompleted,
                WorkDoneDescription = dto.WorkDoneDescription,
                CreatedAt = DateTime.UtcNow
            };
            _context.Feedbacks.Add(fb);
            await _context.SaveChangesAsync();
            return Ok(fb);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var fb = await _context.Feedbacks.FindAsync(id);
            if (fb == null) return NotFound();
            _context.Feedbacks.Remove(fb);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

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
    public class ComplaintsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ComplaintsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet]
        public async Task<IActionResult> GetComplaints()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            IQueryable<Complaint> query = _context.Complaints.Include(c => c.AssignedEmployee);

            if (role == "Citizen")
            {
                query = query.Where(c => c.UserId == userId);
            }

            var complaints = await query.OrderByDescending(c => c.CreatedAt).ToListAsync();
            return Ok(complaints);
        }

        [HttpPost]
        [Authorize(Roles = "Citizen")]
        public async Task<IActionResult> CreateComplaint([FromForm] ComplaintCreateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var complaint = new Complaint
            {
                UserId = userId,
                Title = dto.Title,
                Description = dto.Description
            };

            if (dto.Image != null)
            {
                complaint.ImageUrl = await SaveImage(dto.Image);
            }

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComplaints), new { id = complaint.Id }, complaint);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromForm] ComplaintUpdateDto dto)
        {
            var complaint = await _context.Complaints.FindAsync(id);
            if (complaint == null) return NotFound();

            complaint.Status = dto.Status;

            if (dto.ProofImage != null && dto.Status == "Completed")
            {
                complaint.ProofImageUrl = await SaveImage(dto.ProofImage);
            }

            await _context.SaveChangesAsync();
            return Ok(complaint);
        }

        [HttpPut("{id}/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignComplaint(int id, [FromBody] ComplaintAssignDto dto)
        {
            var complaint = await _context.Complaints.FindAsync(id);
            if (complaint == null) return NotFound();

            var employee = await _context.Employees.FindAsync(dto.EmployeeId);
            if (employee == null) return BadRequest("Invalid Employee Id");

            complaint.AssignedEmployeeId = dto.EmployeeId;
            complaint.Status = "In Progress";
            
            await _context.SaveChangesAsync();
            return Ok(complaint);
        }

        private async Task<string> SaveImage(IFormFile image)
        {
            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return "/uploads/" + uniqueFileName;
        }
    }
}

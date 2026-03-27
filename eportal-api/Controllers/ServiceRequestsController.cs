using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EPortalApi.Data;
using EPortalApi.DTOs;
using EPortalApi.Models;
using System.Security.Claims;

namespace EPortalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ServiceRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ServiceRequestsController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var requests = await _context.ServiceRequests
                .Include(sr => sr.Citizen)
                .Include(sr => sr.Service)
                .Include(sr => sr.Bill)
                .OrderByDescending(sr => sr.CreatedAt)
                .Select(sr => new ServiceRequestDto
                {
                    Id = sr.Id,
                    Status = sr.Status,
                    DocumentUrls = sr.DocumentUrls,
                    CreatedAt = sr.CreatedAt,
                    IDNo = sr.IDNo,
                    CitizenName = sr.Citizen != null ? sr.Citizen.Name : "N/A",
                    SID = sr.SID,
                    ServiceName = sr.Service != null ? sr.Service.SName : "N/A",
                    Bill_ID = sr.Bill_ID,
                    IsPaid = sr.Bill != null ? sr.Bill.IsPaid : false
                })
                .ToListAsync();
            return Ok(requests);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyRequests()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            int uid = int.Parse(userIdStr);

            var requests = await _context.ServiceRequests
                .Where(sr => sr.IDNo == uid)
                .Include(sr => sr.Service)
                .Include(sr => sr.Bill)
                .ToListAsync();
            return Ok(requests);
        }

        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromForm] ServiceRequestCreateDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            int uid = int.Parse(userIdStr);

            var service = await _context.Services.FindAsync(dto.SID);
            if (service == null) return NotFound("Service not found");

            // Handle Documents
            string? docUrls = null;
            if (dto.Documents != null && dto.Documents.Count > 0)
            {
                var paths = new List<string>();
                string uploadDir = Path.Combine(_env.WebRootPath, "uploads", "docs");
                if (!Directory.Exists(uploadDir)) Directory.CreateDirectory(uploadDir);

                foreach (var file in dto.Documents)
                {
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    string filePath = Path.Combine(uploadDir, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    paths.Add($"/uploads/docs/{fileName}");
                }
                docUrls = string.Join(",", paths);
            }

            var request = new ServiceRequest
            {
                IDNo = uid,
                SID = dto.SID,
                Bill_ID = dto.Bill_ID,
                Status = "Pending",
                DocumentUrls = docUrls,
                CreatedAt = DateTime.UtcNow
            };

            _context.ServiceRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(request);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] ServiceRequestStatusDto dto)
        {
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null) return NotFound();

            request.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(request);
        }
    }
}

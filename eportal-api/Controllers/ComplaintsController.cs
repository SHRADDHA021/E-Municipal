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
        private readonly IWebHostEnvironment _env;

        public ComplaintsController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
            var uidStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine($"🔍 Complaints.GetAll: Role={role}, UID={uidStr}");

            var query = _context.Complaints
                .Include(c => c.Citizen)
                .Include(c => c.Employee)
                .Include(c => c.Department)
                .AsQueryable();

            if (role.Equals("Employee", StringComparison.OrdinalIgnoreCase))
            {
                if (int.TryParse(uidStr, out int uid))
                {
                    query = query.Where(c => c.EID == uid);
                    Console.WriteLine($"🔍 Filtered for Employee UID={uid}");
                }
            }
            // Citizens and Admins see all

            var list = await query.OrderByDescending(c => c.C_date).ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var c = await _context.Complaints
                .Include(c => c.Citizen)
                .Include(c => c.Employee)
                .Include(c => c.Department)
                .Include(c => c.Feedbacks)
                .FirstOrDefaultAsync(c => c.CID == id);
            if (c == null) return NotFound();
            return Ok(c);
        }

        [HttpPost]
        [Authorize(Roles = "Citizen")]
        public async Task<IActionResult> Create([FromForm] ComplaintCreateDto dto)
        {
            var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var complaint = new Complaint
            {
                Title = dto.Title,
                Description = dto.Description,
                IDNo = uid
            };

            if (dto.Image != null)
                complaint.ImageUrl = await SaveFile(dto.Image);

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();
            return Ok(complaint);
        }

        [HttpPut("{id}/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Assign(int id, [FromBody] ComplaintAssignDto dto)
        {
            var c = await _context.Complaints.FindAsync(id);
            if (c == null) return NotFound();

            if (dto.EID.HasValue) c.EID = dto.EID;
            if (dto.DNo.HasValue) c.DNo = dto.DNo;
            c.C_status = "In Progress";

            await _context.SaveChangesAsync();
            return Ok(c);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> UpdateStatus(int id, [FromForm] ComplaintStatusDto dto)
        {
            var c = await _context.Complaints.FindAsync(id);
            if (c == null) return NotFound();

            c.C_status = dto.C_status;
            if (dto.ProofImage != null)
                c.ProofImageUrl = await SaveFile(dto.ProofImage);

            await _context.SaveChangesAsync();
            return Ok(c);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _context.Complaints.FindAsync(id);
            if (c == null) return NotFound();
            _context.Complaints.Remove(c);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<string> SaveFile(IFormFile file)
        {
            var folder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            Directory.CreateDirectory(folder);
            var name = Guid.NewGuid() + Path.GetExtension(file.FileName);
            await using var fs = new FileStream(Path.Combine(folder, name), FileMode.Create);
            await file.CopyToAsync(fs);
            return "/uploads/" + name;
        }
    }
}

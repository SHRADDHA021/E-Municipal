using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EPortalApi.Data;

namespace EPortalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class CitizensController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CitizensController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Citizens
                .Select(c => new { c.IDNo, c.Name, c.Email })
                .ToListAsync();
            return Ok(users);
        }
    }
}

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
    public class NewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public NewsController(ApplicationDbContext context) { _context = context; }

        // ── Public: anyone can read active news (used by HomePage ticker) ──
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var news = await _context.News
                .Where(n => n.IsActive)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new { n.Id, n.Emoji, n.Title, n.IsActive, n.CreatedAt })
                .ToListAsync();
            return Ok(news);
        }

        // ── Admin: get ALL news (including inactive) for management ──
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAdmin()
        {
            var news = await _context.News
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new { n.Id, n.Emoji, n.Title, n.IsActive, n.CreatedAt, n.UpdatedAt })
                .ToListAsync();
            return Ok(news);
        }

        // ── Admin: create news ──
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] NewsCreateDto dto)
        {
            var item = new News
            {
                Title = dto.Title,
                Emoji = dto.Emoji,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };
            _context.News.Add(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        // ── Admin: update news ──
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] NewsCreateDto dto)
        {
            var item = await _context.News.FindAsync(id);
            if (item == null) return NotFound();
            item.Title = dto.Title;
            item.Emoji = dto.Emoji;
            item.IsActive = dto.IsActive;
            item.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        // ── Admin: delete news ──
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.News.FindAsync(id);
            if (item == null) return NotFound();
            _context.News.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

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
    public class BillsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BillsController(ApplicationDbContext context) { _context = context; }

        // GET /api/bills - Citizen gets own bills
        [HttpGet]
        [Authorize(Roles = "Citizen")]
        public async Task<IActionResult> GetMyBills()
        {
            var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var bills = await _context.Bills
                .Where(b => b.IDNo != null && b.IDNo == uid)
                .Include(b => b.BillServices).ThenInclude(bs => bs.Service)
                .OrderByDescending(b => b.P_date)
                .ToListAsync();
            return Ok(bills);
        }

        // Admin GET all bills
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllBills()
        {
            var bills = await _context.Bills
                .Include(b => b.Citizen)
                .Include(b => b.BillServices).ThenInclude(bs => bs.Service)
                .OrderByDescending(b => b.P_date)
                .ToListAsync();
            return Ok(bills);
        }

        // POST /api/bills - Citizen creates bill with selected services
        [HttpPost]
        [Authorize(Roles = "Citizen")]
        public async Task<IActionResult> CreateBill([FromBody] BillCreateDto dto)
        {
            var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (!dto.ServiceIds.Any())
                return BadRequest("Select at least one service");

            var services = await _context.Services
                .Where(s => dto.ServiceIds.Contains(s.SID))
                .ToListAsync();

            if (!services.Any())
                return BadRequest("Invalid service IDs");

            var bill = new Bill
            {
                IDNo = uid,
                P_date = DateTime.UtcNow,
                Total_amt = services.Sum(s => s.Rate),
                IsPaid = false,
                BillServices = services.Select(s => new BillService
                {
                    SID = s.SID,
                    Rate = s.Rate
                }).ToList()
            };

            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();
            return Ok(bill);
        }

        // POST /api/bills/{id}/pay
        [HttpPost("{id}/pay")]
        [Authorize(Roles = "Citizen")]
        public async Task<IActionResult> PayBill(int id, [FromBody] BillPayDto dto)
        {
            var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var bill = await _context.Bills.FirstOrDefaultAsync(b => b.Bill_ID == id && b.IDNo == uid);
            if (bill == null) return NotFound();
            if (bill.IsPaid) return BadRequest("Bill already paid");

            bill.IsPaid = true;
            bill.PaymentMethod = dto.PaymentMethod;
            bill.P_date = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(bill);
        }

        // --- NEW UTILITY BILLING (ADMIN/CITIZEN) ---

        // ADMIN: Create manual bill
         [HttpPost("admin")]
         [Authorize(Roles = "Admin")]
         public async Task<IActionResult> CreateAdminBill([FromBody] BillCreateDto dto)
         {
             int? targetId = (dto.IDNo > 0) ? dto.IDNo : null;
             
             if (targetId.HasValue)
             {
                 var citizenExists = await _context.Citizens.AnyAsync(c => c.IDNo == targetId.Value);
                 if (!citizenExists) return BadRequest($"Citizen with ID {targetId.Value} not found");
             }
 
             var bill = new Bill
             {
                 IDNo = targetId,
                CitizenName = dto.CitizenName,
                Total_amt = dto.Total_amt ?? 0,
                BillType = dto.BillType,
                ConsumerNumber = dto.ConsumerNumber,
                DueDate = dto.DueDate,
                IsPaid = false,
                P_date = DateTime.UtcNow
            };
            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();
            return Ok(bill);
        }

        // ADMIN: Update manual bill
        [HttpPut("{id}/admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAdminBill(int id, [FromBody] BillCreateDto dto)
        {
            var bill = await _context.Bills.FindAsync(id);
            if (bill == null) return NotFound();
            if (bill.IsPaid) return BadRequest("Cannot edit paid bill");

            bill.IDNo = dto.IDNo;
            bill.CitizenName = dto.CitizenName;
            bill.Total_amt = dto.Total_amt ?? bill.Total_amt;
            bill.BillType = dto.BillType;
            bill.ConsumerNumber = dto.ConsumerNumber;
            bill.DueDate = dto.DueDate;

            await _context.SaveChangesAsync();
            return Ok(bill);
        }

        // ADMIN: Delete manual bill
        [HttpDelete("{id}/admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAdminBill(int id)
        {
            var bill = await _context.Bills.FindAsync(id);
            if (bill == null) return NotFound();
            _context.Bills.Remove(bill);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // CITIZEN: Fetch utility bill by type & consumer number
        [HttpGet("fetch")]
        [AllowAnonymous]
        public async Task<IActionResult> FetchBill(string type, string consumerNumber)
        {
            var bill = await _context.Bills
                .Where(b => b.BillType == type && b.ConsumerNumber == consumerNumber)
                .OrderByDescending(b => b.P_date)
                .Select(b => new BillDto {
                    Bill_ID = b.Bill_ID,
                    P_date = b.P_date,
                    Total_amt = b.Total_amt,
                    IsPaid = b.IsPaid,
                    PaymentMethod = b.PaymentMethod,
                    IDNo = b.IDNo,
                    CitizenName = b.CitizenName,
                    ConsumerNumber = b.ConsumerNumber,
                    BillType = b.BillType,
                    DueDate = b.DueDate
                })
                .FirstOrDefaultAsync();

            if (bill == null) return NotFound("Bill not found for this identifier");
            return Ok(bill);
        }
    }
}

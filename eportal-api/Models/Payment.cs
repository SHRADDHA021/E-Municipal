using System.ComponentModel.DataAnnotations;

namespace EPortalApi.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public decimal Amount { get; set; }
        public string Status { get; set; } = "Completed"; // Mock payment usually complete
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    }
}

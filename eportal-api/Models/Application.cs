using System.ComponentModel.DataAnnotations;

namespace EPortalApi.Models
{
    public class Application
    {
        [Key]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        public User? User { get; set; }

        public int ServiceId { get; set; }
        public Service? Service { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

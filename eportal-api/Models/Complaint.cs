using System.ComponentModel.DataAnnotations;

namespace EPortalApi.Models
{
    public class Complaint
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? ProofImageUrl { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, In Progress, Completed
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Optionally linked to employee
        public int? AssignedEmployeeId { get; set; }
        public Employee? AssignedEmployee { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EPortalApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;
        public required string Phone { get; set; }
        public required string Role { get; set; } // Admin, Citizen

        // Navigation properties
        public List<Complaint> Complaints { get; set; } = new();
        public List<Application> Applications { get; set; } = new();
        public List<Payment> Payments { get; set; } = new();
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EPortalApi.Models
{
    [Table("Citizen")]
    public class Citizen
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IDNo { get; set; }

        [Required] public string Name { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public string? Bday { get; set; }
        public string? Phno { get; set; }
        public string? House_no { get; set; }
        public string? Street_no_name { get; set; }

        [Required] public string Email { get; set; } = string.Empty;

        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation
        [JsonIgnore] public List<Complaint> Complaints { get; set; } = new();
        [JsonIgnore] public List<Feedback> Feedbacks { get; set; } = new();
        [JsonIgnore] public List<Bill> Bills { get; set; } = new();
        [JsonIgnore] public List<ServiceRequest> ServiceRequests { get; set; } = new();
    }
}

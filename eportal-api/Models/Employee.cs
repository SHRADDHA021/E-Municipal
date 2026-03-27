using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EPortalApi.Models
{
    [Table("Employee")]
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EID { get; set; }

        [Required] public string EName { get; set; } = string.Empty;
        [Required] public string Email { get; set; } = string.Empty;
        public string? Phno { get; set; }
        public string? EAdd { get; set; }
        public decimal Salary { get; set; }
        [JsonIgnore] public string PasswordHash { get; set; } = string.Empty;

        // FK: Works for Department (M:1)
        public int DNo { get; set; }
        public Department? Department { get; set; }

        // Navigation
        [JsonIgnore] public List<Complaint> Complaints { get; set; } = new();
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EPortalApi.Models
{
    [Table("Department")]
    public class Department
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DNo { get; set; }

        [Required] public string DName { get; set; } = string.Empty;

        // Navigation
        public List<Employee> Employees { get; set; } = new();
        public List<Complaint> Complaints { get; set; } = new();
        public List<Service> Services { get; set; } = new();
    }
}

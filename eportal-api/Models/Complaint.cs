using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPortalApi.Models
{
    [Table("Complaint")]
    public class Complaint
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CID { get; set; }

        [Required] public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string C_status { get; set; } = "Pending"; // Pending, In Progress, Completed
        public DateTime C_date { get; set; } = DateTime.UtcNow;
        public string? ImageUrl { get; set; }
        public string? ProofImageUrl { get; set; }

        // FK: Reports (Citizen -> Complaint 1:M)
        public int IDNo { get; set; }
        public Citizen? Citizen { get; set; }

        // FK: Assigned to Employee (1:M)
        public int? EID { get; set; }
        public Employee? Employee { get; set; }

        // FK: Assigned to Department (1:M)
        public int? DNo { get; set; }
        public Department? Department { get; set; }

        // Navigation
        public List<Feedback> Feedbacks { get; set; } = new();
    }
}

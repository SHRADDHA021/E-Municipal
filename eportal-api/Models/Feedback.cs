using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPortalApi.Models
{
    [Table("Feedback")]
    public class Feedback
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FID { get; set; }

        public string? Subject { get; set; }
        public string? Message { get; set; }
        public int Rating { get; set; } = 5;
        public bool IsCompleted { get; set; }
        public string? WorkDoneDescription { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // FK: Gives (Citizen -> Feedback 1:M)
        public int? IDNo { get; set; }
        public Citizen? Citizen { get; set; }

        // FK: Refers To (Complaint -> Feedback 1:M)
        public int? CID { get; set; }
        public Complaint? Complaint { get; set; }
    }
}

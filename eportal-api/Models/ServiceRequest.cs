using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPortalApi.Models
{
    [Table("ServiceRequests")]
    public class ServiceRequest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Paid, Approved, Rejected, Completed
        public string? DocumentUrls { get; set; } // JSON string or comma-separated paths
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // FK: Citizen who applied
        public int IDNo { get; set; }
        public Citizen? Citizen { get; set; }

        // FK: Service applied for
        public int SID { get; set; }
        public Service? Service { get; set; }

        // FK: Linked Bill (Payment)
        public int? Bill_ID { get; set; }
        public Bill? Bill { get; set; }
    }
}

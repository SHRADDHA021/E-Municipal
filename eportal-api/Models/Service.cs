using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EPortalApi.Models
{
    [Table("Services")]
    public class Service
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SID { get; set; }

        [Required] public string SName { get; set; } = string.Empty;
        public decimal Rate { get; set; }
        public string RequiredDocs { get; set; } = string.Empty; // e.g. "Aadhar, Photo"

        // FK: Department provides Services (1:M)
        public int? DNo { get; set; }
        public Department? Department { get; set; }

        // Navigation
        [JsonIgnore] public List<BillService> BillServices { get; set; } = new();
        [JsonIgnore] public List<ServiceRequest> ServiceRequests { get; set; } = new();
    }
}

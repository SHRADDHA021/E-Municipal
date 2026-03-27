using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EPortalApi.Models
{
    [Table("Bill")]
    public class Bill
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Bill_ID { get; set; }

        public DateTime P_date { get; set; } = DateTime.UtcNow;
        public decimal Total_amt { get; set; }
        public string? PaymentMethod { get; set; }
        public bool IsPaid { get; set; } = false;

        // Utility Billing Fields
        public string? ConsumerNumber { get; set; } // Property ID / Consumer Number
        public string? BillType { get; set; }      // Water, Electricity, PropertyTax
        public DateTime? DueDate { get; set; }
        public string? CitizenName { get; set; }

        // FK: Citizen Pays Bill (1:M)
        public int? IDNo { get; set; }
        public Citizen? Citizen { get; set; }

        // Junction: Bill <-> Services (M:M via BillServices)
        public List<BillService> BillServices { get; set; } = new();

        // 1:1 with ServiceRequest
        [JsonIgnore] public ServiceRequest? ServiceRequest { get; set; }
    }
}

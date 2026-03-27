using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EPortalApi.Models
{
    // Junction table: BillServices (M:M between Bill and Services)
    [Table("BillServices")]
    public class BillService
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int Bill_ID { get; set; }
        public Bill? Bill { get; set; }

        public int SID { get; set; }
        public Service? Service { get; set; }

        public decimal Rate { get; set; } // snapshot of rate at time of billing
    }
}

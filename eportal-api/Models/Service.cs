using System.ComponentModel.DataAnnotations;

namespace EPortalApi.Models
{
    public class Service
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Amount { get; set; }
        
        public List<Application> Applications { get; set; } = new();
    }
}

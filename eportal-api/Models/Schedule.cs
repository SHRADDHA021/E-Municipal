using System.ComponentModel.DataAnnotations;

namespace EPortalApi.Models
{
    public class Schedule
    {
        [Key]
        public int Id { get; set; }
        public required string Type { get; set; } // "Garbage" or "Water"
        public required string Area { get; set; }
        public required string Time { get; set; }
    }
}

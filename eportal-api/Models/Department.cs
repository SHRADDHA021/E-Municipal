using System.ComponentModel.DataAnnotations;

namespace EPortalApi.Models
{
    public class Department
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }

        public List<Employee> Employees { get; set; } = new();
    }
}

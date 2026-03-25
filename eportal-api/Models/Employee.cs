using System.ComponentModel.DataAnnotations;

namespace EPortalApi.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
        
        public int DepartmentId { get; set; }
        public Department? Department { get; set; }

        public List<Complaint> AssignedComplaints { get; set; } = new();
    }
}

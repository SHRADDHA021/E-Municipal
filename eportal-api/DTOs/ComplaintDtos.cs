using Microsoft.AspNetCore.Http; // For IFormFile

namespace EPortalApi.DTOs
{
    public class ComplaintCreateDto
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        
        // Removed validation to allow submitting via form-data seamlessly
        public IFormFile? Image { get; set; }
    }

    public class ComplaintUpdateDto
    {
        public required string Status { get; set; }
        public IFormFile? ProofImage { get; set; }
    }

    public class ComplaintAssignDto
    {
        public int EmployeeId { get; set; }
    }
}

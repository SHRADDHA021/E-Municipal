namespace EPortalApi.DTOs
{
    // ─── Auth ───────────────────────────────────────────────────────────────
    public class CitizenRegisterDto
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? Phno { get; set; }
        public string? Gender { get; set; }
        public string? Bday { get; set; }
        public string? House_no { get; set; }
        public string? Street_no_name { get; set; }
    }

    public class EmployeeRegisterDto
    {
        public required string EName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public int DNo { get; set; }
        public string? Phno { get; set; }
        public string? EAdd { get; set; }
        public decimal Salary { get; set; }
    }

    public class LoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; } // "Citizen" | "Admin" | "Employee"
    }

    public class LoginResponseDto
    {
        public required string Token { get; set; }
        public required string Role { get; set; }
        public required string Name { get; set; }
        public int UserId { get; set; }
    }

    // ─── Complaint ───────────────────────────────────────────────────────────
    public class ComplaintCreateDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
    }

    public class ComplaintAssignDto
    {
        public int? EID { get; set; }
        public int? DNo { get; set; }
    }

    public class ComplaintStatusDto
    {
        public required string C_status { get; set; }
        public IFormFile? ProofImage { get; set; }
    }

    // ─── Feedback ───────────────────────────────────────────────────────────
    public class FeedbackCreateDto
    {
        public string? Subject { get; set; }
        public string? Message { get; set; }
        public int Rating { get; set; } = 5;
        public int? CID { get; set; }
        public bool IsCompleted { get; set; }
        public string? WorkDoneDescription { get; set; }
    }

    // ─── Service ────────────────────────────────────────────────────────────
    public class ServiceCreateDto
    {
        public required string SName { get; set; }
        public decimal Rate { get; set; }
        public int? DNo { get; set; }
        public string RequiredDocs { get; set; } = string.Empty;
    }

    // ─── ServiceRequest ─────────────────────────────────────────────────────
    public class ServiceRequestCreateDto
    {
        public int SID { get; set; }
        public int? Bill_ID { get; set; }
        public List<IFormFile>? Documents { get; set; }
    }

    public class ServiceRequestStatusDto
    {
        public required string Status { get; set; } // Approved, Rejected, Completed
    }

    public class ServiceRequestDto
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? DocumentUrls { get; set; }
        public DateTime CreatedAt { get; set; }
        public int IDNo { get; set; }
        public string? CitizenName { get; set; }
        public int SID { get; set; }
        public string? ServiceName { get; set; }
        public int? Bill_ID { get; set; }
        public bool? IsPaid { get; set; }
    }

    // ─── Bill ───────────────────────────────────────────────────────────────
    public class BillCreateDto
    {
        public List<int>? ServiceIds { get; set; } = new(); // For service requests
        public decimal? Total_amt { get; set; }           // For manual billing
        public int? IDNo { get; set; }                    // For manual billing
        public string? ConsumerNumber { get; set; }
        public string? BillType { get; set; }
        public DateTime? DueDate { get; set; }
        public string? CitizenName { get; set; }
    }

    public class BillPayDto
    {
        public required string PaymentMethod { get; set; }
    }

    public class BillDto
    {
        public int Bill_ID { get; set; }
        public DateTime P_date { get; set; }
        public decimal Total_amt { get; set; }
        public string? PaymentMethod { get; set; }
        public bool IsPaid { get; set; }
        public int? IDNo { get; set; }
        public string? CitizenName { get; set; }
        public string? ConsumerNumber { get; set; }
        public string? BillType { get; set; }
        public DateTime? DueDate { get; set; }
    }

    // ─── Department ─────────────────────────────────────────────────────────
    public class DepartmentCreateDto
    {
        public required string DName { get; set; }
    }
}

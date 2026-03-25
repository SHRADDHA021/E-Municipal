namespace EPortalApi.DTOs
{
    public class RegisterDto
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Phone { get; set; }
        public string Role { get; set; } = "Citizen"; // Admin or Citizen
    }

    public class LoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class LoginResponseDto
    {
        public required string Token { get; set; }
        public required string Role { get; set; }
        public required string Name { get; set; }
        public int UserId { get; set; }
    }
}

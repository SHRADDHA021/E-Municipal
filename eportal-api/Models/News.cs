namespace EPortalApi.Models
{
    public class News
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Emoji { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}

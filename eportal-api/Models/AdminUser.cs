// Kept for Admin auth only - Admin is not in ER diagram as entity but is needed for system login
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EPortalApi.Models
{
    [Table("AdminUser")]
    public class AdminUser
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required] public string Name { get; set; } = string.Empty;
        [Required] public string Email { get; set; } = string.Empty;
        [JsonIgnore] public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Admin";
    }
}

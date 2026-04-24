using System.Security.Claims;

namespace EPortalApi.Controllers
{
    public static class ClaimsPrincipalExtensions
    {
        public static string? FindFirstValue(this ClaimsPrincipal principal, string claimType)
        {
            if (principal == null) throw new ArgumentNullException(nameof(principal));
            return principal.FindFirst(claimType)?.Value;
        }
    }
}

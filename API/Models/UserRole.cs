using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class UserRole : IdentityUserRole<int>
    {
        public User User { get; set; } = null!;
        public Role Role { get; set; } = null!;
    }
}
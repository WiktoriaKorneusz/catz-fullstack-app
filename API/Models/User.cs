using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class User : IdentityUser<int>
    {

        public DateOnly DateOfBirth { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public string Pronouns { get; set; }
        public string Introduction { get; set; }
        public string About { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public List<Post> Posts { get; set; } = [];
        public List<UserFollow> Followers { get; set; } = []; //followed by
        public List<UserFollow> Followings { get; set; } = []; //follows

        public List<Message> MessagesSent { get; set; } = [];
        public List<Message> MessagesReceived { get; set; } = [];

        public ICollection<UserRole> UserRoles { get; set; } = [];


    }


}
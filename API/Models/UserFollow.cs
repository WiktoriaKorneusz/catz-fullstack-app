namespace API.Models
{
    public class UserFollow
    {
        public User Follower { get; set; } //source
        public int FollowerId { get; set; }
        public User Followee { get; set; } //target
        public int FolloweeId { get; set; }
    }
}
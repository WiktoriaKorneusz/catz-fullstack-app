namespace API.Helpers
{
    public class FollowsParams : PaginationParams
    {
        public int UserId { get; set; }
        public required string Choice { get; set; } = "followers";
    }
}
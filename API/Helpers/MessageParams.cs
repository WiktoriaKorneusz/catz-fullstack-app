namespace API.Helpers
{
    public class MessageParams : PaginationParams
    {
        public int? Id { get; set; }
        public string Type { get; set; } = "unread";
    }
}
namespace API.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string SenderUsername { get; set; }
        public string RecipientUsername { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; }
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }

        public int SenderId { get; set; }
        public int RecipientId { get; set; }

        public string SenderProfilePicture { get; set; }
        public string RecipientProfilePicture { get; set; }
    }
}
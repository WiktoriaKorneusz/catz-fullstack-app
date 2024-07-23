namespace API.DTOs
{
    public class PostDisplayDto
    {
        public int Id { get; set; }
        public string MainPhotoUrl { get; set; }
        public string UserName { get; set; }
        public string KnownAs { get; set; }
        public string Pronouns { get; set; }
        public string Content { get; set; }
        public DateTime Created { get; set; }
        public List<PhotoDto> Photos { get; set; }

    }
}
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("Posts")]
    public class Post
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int UserId { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public User User { get; set; }
        public List<Photo> Photos { get; set; } = new();
        public bool IsApproved { get; set; } = false;

    }
}
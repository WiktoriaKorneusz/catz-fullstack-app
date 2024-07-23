using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Connection
    {
        [Key]
        public string ConnectionId { get; set; }
        public int UserId { get; set; }
    }
}
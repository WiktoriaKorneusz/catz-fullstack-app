using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Group
    {
        [Key]
        public string Name { get; set; }
        public ICollection<Connection> Connections { get; set; } = [];
    }


}
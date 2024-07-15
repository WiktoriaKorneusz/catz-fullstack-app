using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Connection
    {
        [Key]
        public string ConnectionId { get; set; }
        public int UserId { get; set; }
    }
}
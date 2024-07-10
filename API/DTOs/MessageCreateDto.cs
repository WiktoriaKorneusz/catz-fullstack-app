using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class MessageCreateDto
    {
        public string Content { get; set; }
        public int RecipientId { get; set; }

    }
}
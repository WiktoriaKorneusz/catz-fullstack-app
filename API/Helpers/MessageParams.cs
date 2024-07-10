using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class MessageParams : PaginationParams
    {
        public int? Id { get; set; }
        public string Type { get; set; } = "unread";
    }
}
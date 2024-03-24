using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserInfoDto
    {
        public string UserName { get; set; }
        public string MainPhotoUrl { get; set; }
        public string KnownAs { get; set; }
        public string Pronouns { get; set; }

    }
}
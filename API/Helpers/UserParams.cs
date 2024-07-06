using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class UserParams : PaginationParams
    {


        public string CurrentUsername { get; set; }
        public int MinimalAge { get; set; } = 0;
        public int MaximalAge { get; set; } = 100;
        public int OrderBy { get; set; } = 0;


    }
}
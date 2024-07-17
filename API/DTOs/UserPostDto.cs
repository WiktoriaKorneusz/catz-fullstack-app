using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;

namespace API.DTOs
{
    public class UserPostDto
    {
        public int Id { get; set; }
        public string FirstPhotoUrl { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public DateOnly? DateOfBirth { get; set; }

        [Required]
        public string KnownAs { get; set; }

        [Required]
        public DateTime Created { get; set; } = DateTime.UtcNow;

        [Required]
        public string Pronouns { get; set; }

        [Required]
        public string Interests { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 6)]
        public string Password { get; set; }

        public string? ClientUri { get; set; }


    }
}
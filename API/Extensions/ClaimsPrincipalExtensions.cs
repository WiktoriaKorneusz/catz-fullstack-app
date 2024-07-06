using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        // User.FindFirst(ClaimTypes.NameIdentifier)?.Value
    
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static int GetUserId(this ClaimsPrincipal user)
        {
            var id = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine("\n\n\n" + id + "\n\n\n");
            if (id == null)
            {
                return 0;
            }
            return int.Parse(id);
        }

    }
}


    // public static string GetUsername(this ClaimsPrincipal user)
        // {
        //     return user.FindFirst(ClaimTypes.Name)?.Value;
        // }
        // public static string GetUserId(this ClaimsPrincipal user)
        // {
        //     return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        // }
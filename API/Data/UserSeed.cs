using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var users = JsonSerializer.Deserialize<List<User>>(userData, options);

            var roles = new List<Role>
            {
                new() { Name = "User" },
                new() { Name = "Admin" },
                new() { Name = "Moderator" }
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            };

            foreach (var user in users)
            {
                // using var hmac = new HMACSHA512();

                user.UserName = user.UserName.ToLower();
                // user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("P4$$w0rd"));
                // user.PasswordSalt = hmac.Key;

                await userManager.CreateAsync(user, "P4$$w0rd");
                await userManager.AddToRoleAsync(user, "User");

            }

            var admin = new User
            {
                UserName = "admin",
                KnownAs = "admin",
                Pronouns = "",
                City = "",
                Country = "",
            };

            await userManager.CreateAsync(admin, "P4$$w0rd");
            await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
        }
        // await userManager.SaveChangesAsync();
    }
}

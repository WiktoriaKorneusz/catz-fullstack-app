using System.Text.Json;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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

                user.UserName = user.UserName.ToLower();
                user.EmailConfirmed = true;
                user.Posts.FirstOrDefault().IsApproved = true;


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
                EmailConfirmed = true
            };

            await userManager.CreateAsync(admin, "P4$$w0rd");
            await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
        }
    }
}

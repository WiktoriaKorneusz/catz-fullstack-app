using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<UserFollow> Follows { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserFollow>()
                .HasKey(k => new { k.FollowerId, k.FolloweeId });

            builder.Entity<UserFollow>()
                .HasOne(s => s.Follower)
                .WithMany(c => c.Followings)
                .HasForeignKey(s => s.FollowerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollow>()
                .HasOne(s => s.Followee)
                .WithMany(c => c.Followers)
                .HasForeignKey(s => s.FolloweeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
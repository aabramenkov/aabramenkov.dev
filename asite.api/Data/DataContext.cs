using jsite.api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using jsite.api.Data.Configuration;
using Microsoft.AspNetCore.Identity;

namespace jsite.api.Data
{
    public class DataContext : IdentityDbContext<User, Role, int>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Article> Articles {get;set;}
        public DbSet<Category> Categories {get;set;}
        public DbSet<Post> Posts {get;set;}
        public DbSet<PostCategory> PostCategories {get;set;}
        public DbSet<Comment> Comments {get;set;}
        public DbSet<ChildComment> ChildComments {get;set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>()
                .HasIndex(u => u.Url)
                .IsUnique();

            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new CategoryConfiguration());
            modelBuilder.ApplyConfiguration(new RoleConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new UsersWithRolesConfiguration());
            modelBuilder.ApplyConfiguration(new ArticleConfiguration());

        }
    }
}
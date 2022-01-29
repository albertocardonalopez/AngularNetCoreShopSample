using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>().HasData(new Product
            {
                Id = 1,
                Name = "Product 1",
            });
            modelBuilder.Entity<Product>().HasData(new Product
            {
                Id = 2,
                Name = "Product 2",
            });
            modelBuilder.Entity<Product>().HasData(new Product
            {
                Id = 3,
                Name = "Product 3",
            });
            modelBuilder.Entity<Product>().HasData(new Product
            {
                Id = 4,
                Name = "Product 4",
            });
        }
    }
}

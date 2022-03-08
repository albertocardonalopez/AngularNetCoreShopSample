using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.OwnsOne(x => x.ShipToAddress, a =>
            {
                a.WithOwner();
            });

            builder.Property(x => x.Status)
                .HasConversion(
                    o => o.ToString(),
                    o => (OrderStatus) Enum.Parse(typeof(OrderStatus), o)
                );

            builder.HasMany(x => x.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
        }
    }
}

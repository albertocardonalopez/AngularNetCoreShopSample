using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IProductRepository
    {
        Task<Product> GetProductByIdAsync(int id);
        Task<IReadOnlyCollection<Product>> GetAllProductsAsync();
        Task<IReadOnlyCollection<ProductBrand>> GetProductBrandsAsync();
        Task<IReadOnlyCollection<ProductType>> GetProductTypesAsync();
    }
}

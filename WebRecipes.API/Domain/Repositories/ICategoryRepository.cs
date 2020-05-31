using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Repositories
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> ListAsync();
         Task AddAsync(Category category);
         Task<Category> FindByIdAsync(int id);
         void Update(Category category);
         void Remove(Category category);
    }
}
using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Repositories
{
    public interface IRecipeRepository
    {
        Task<IEnumerable<Recipe>> ListAsync();
        Task AddAsync(Recipe recipe);
        Task<Recipe> FindByIdAsync(int id);
        void Update(Recipe recipe);
        void Remove(Recipe recipe);
        Task AddRangeAsync(IEnumerable<Recipe> range);
    }
}
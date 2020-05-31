using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Domain.Services
{
    public interface IRecipeService
    {
         Task<IEnumerable<Recipe>> ListAsync();
         Task<RecipeResponse> SaveAsync(Recipe recipe);
         Task<RecipeResponse> UpdateAsync(int id, Recipe recipe);
         Task<RecipeResponse> DeleteAsync(int id);
    }
}
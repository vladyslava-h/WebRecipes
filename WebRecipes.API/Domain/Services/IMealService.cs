using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Domain.Services
{
    public interface IMealService
    {
         Task<IEnumerable<Meal>> ListAsync();
         Task<MealResponse> SaveAsync(Meal meal);
         Task<MealResponse> UpdateAsync(int id, Meal meal);
         Task<MealResponse> DeleteAsync(int id);
    }
}
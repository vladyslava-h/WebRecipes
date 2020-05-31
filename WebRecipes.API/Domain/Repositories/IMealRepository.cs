using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Repositories
{
    public interface IMealRepository
    {
        Task<IEnumerable<Meal>> ListAsync();
         Task AddAsync(Meal meal);
         Task<Meal> FindByIdAsync(int id);
         void Update(Meal meal);
         void Remove(Meal meal);
    }
}
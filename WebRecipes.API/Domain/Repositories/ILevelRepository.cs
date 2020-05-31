using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Repositories
{
    public interface ILevelRepository
    {
        Task<IEnumerable<Level>> ListAsync();
         Task AddAsync(Level level);
         Task<Level> FindByIdAsync(int id);
         void Update(Level level);
         void Remove(Level level);
    }
}
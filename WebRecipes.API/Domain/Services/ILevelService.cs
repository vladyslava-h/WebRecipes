using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Domain.Services
{
    public interface ILevelService
    {
         Task<IEnumerable<Level>> ListAsync();
         Task<LevelResponse> SaveAsync(Level level);
         Task<LevelResponse> UpdateAsync(int id, Level level);
         Task<LevelResponse> DeleteAsync(int id);
    }
}
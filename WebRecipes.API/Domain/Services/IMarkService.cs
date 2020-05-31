using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Domain.Services
{
    public interface IMarkService
    {
         Task<IEnumerable<Mark>> ListAsync();
         Task<MarkResponse> SaveAsync(Mark mark);
         Task<MarkResponse> UpdateAsync(int id, Mark mark);
         Task<MarkResponse> DeleteAsync(int id);
    }
}
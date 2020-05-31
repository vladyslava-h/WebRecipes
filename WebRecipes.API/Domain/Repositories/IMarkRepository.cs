using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Repositories
{
    public interface IMarkRepository
    {
        Task<IEnumerable<Mark>> ListAsync();
         Task AddAsync(Mark mark);
         Task<Mark> FindByIdAsync(int id);
         void Update(Mark mark);
         void Remove(Mark mark);
    }
}
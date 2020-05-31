using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Repositories
{
    public interface ILikeRepository
    {
        Task<IEnumerable<Like>> ListAsync();
         Task AddAsync(Like like);
         Task<Like> FindByIdAsync(int id);
         void Update(Like like);
         void Remove(Like like);
    }
}
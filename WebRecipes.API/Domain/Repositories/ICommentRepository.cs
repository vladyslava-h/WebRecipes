using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Repositories
{
    public interface ICommentRepository
    {
        Task<IEnumerable<Comment>> ListAsync();
         Task AddAsync(Comment comment);
         Task<Comment> FindByIdAsync(int id);
         void Update(Comment comment);
         void Remove(Comment comment);
    }
}
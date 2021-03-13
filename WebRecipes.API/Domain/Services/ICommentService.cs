using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Domain.Services
{
    public interface ICommentService
    {
         Task<IEnumerable<Comment>> ListAsync();
         Task<CommentResponse> SaveAsync(Comment comment);
         Task<CommentResponse> UpdateAsync(int id, Comment comment);
         Task<CommentResponse> DeleteAsync(int id);
    }
}
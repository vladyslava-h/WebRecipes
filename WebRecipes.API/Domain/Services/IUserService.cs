using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Domain.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> ListAsync();
         Task<UserResponse> SaveAsync(User user);
         Task<UserResponse> UpdateAsync(int id, User user);
         Task<UserResponse> DeleteAsync(int id);
    }
}
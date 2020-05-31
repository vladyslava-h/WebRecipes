using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> ListAsync();
         Task AddAsync(User user);
         Task<User> FindByIdAsync(int id);
         void Update(User user);
         void Remove(User user);
         Task AddRangeAsync(IEnumerable<User> range);
    }
}
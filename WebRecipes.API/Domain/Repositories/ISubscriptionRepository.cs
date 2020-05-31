using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Repositories
{
    public interface ISubscriptionRepository
    {
        Task<IEnumerable<Subscription>> ListAsync();
        Task AddAsync(Subscription subscription);
        Task<Subscription> FindByIdAsync(int id);
        void Update(Subscription subscription);
        void Remove(Subscription subscription);
        Task AddRangeAsync(IEnumerable<Subscription> range);
    }
}
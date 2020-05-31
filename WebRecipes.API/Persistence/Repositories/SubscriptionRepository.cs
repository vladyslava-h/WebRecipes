using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Persistence.Contexts;

namespace WebRecipes.API.Persistence
{
    public class SubscriptionRepository : BaseRepository, ISubscriptionRepository
    {
        public SubscriptionRepository(AppDbContext context) : base(context)
        {
        }

        public async Task AddAsync(Subscription subscription)
        {
            await context.Subscriptions.AddAsync(subscription);
        }

        public async Task AddRangeAsync(IEnumerable<Subscription> range)
        {
            await context.Subscriptions.AddRangeAsync(range);
        }

        public async Task<Subscription> FindByIdAsync(int id)
        {
            return await context.Subscriptions.FindAsync(id);
        }

        public async Task<IEnumerable<Subscription>> ListAsync()
        {
            return await context.Subscriptions.ToListAsync();
        }

        public void Remove(Subscription subscription)
        {
            context.Subscriptions.Remove(subscription);
        }

        public void Update(Subscription subscription)
        {
            context.Subscriptions.Update(subscription);
        }
    }
}
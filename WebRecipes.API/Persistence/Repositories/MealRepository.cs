using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Persistence.Contexts;

namespace WebRecipes.API.Persistence
{
    public class MealRepository : BaseRepository, IMealRepository
    {
        public MealRepository(AppDbContext context) : base(context)
        {
        }

        public async Task AddAsync(Meal meal)
        {
            await context.Meals.AddAsync(meal);
        }

        public async Task<Meal> FindByIdAsync(int id)
        {
            return await context.Meals.FindAsync(id);
        }

        public async Task<IEnumerable<Meal>> ListAsync()
        {
            return await context.Meals.ToListAsync();
        }

        public void Remove(Meal meal)
        {
            context.Meals.Remove(meal);
        }

        public void Update(Meal meal)
        {
            context.Meals.Update(meal);
        }
    }
}
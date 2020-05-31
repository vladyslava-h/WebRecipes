using System.Net.Mime;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Persistence.Contexts;

namespace WebRecipes.API.Persistence
{
    public class RecipeRepository : BaseRepository, IRecipeRepository
    {
        public RecipeRepository(AppDbContext context) : base(context)
        {
        }

        public async Task AddAsync(Recipe recipe)
        {
            await context.Recipes.AddAsync(recipe);
        }

        public async Task<Recipe> FindByIdAsync(int id)
        {
            return await context.Recipes.FindAsync(id);
        }

        public async Task AddRangeAsync(IEnumerable<Recipe> range)
        {
            await context.Recipes.AddRangeAsync(range);
        }

        public async Task<IEnumerable<Recipe>> ListAsync()
        {
            return await context.Recipes.ToListAsync();
        }

        public void Remove(Recipe recipe)
        {
            context.Recipes.Remove(recipe);
        }

        public void Update(Recipe recipe)
        {
            context.Recipes.Update(recipe);
        }
    }
}
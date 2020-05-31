using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Persistence.Contexts;

namespace WebRecipes.API.Persistence
{
    public class LevelRepository : BaseRepository, ILevelRepository
    {
        public LevelRepository(AppDbContext context) : base(context)
        {
        }

        public async Task AddAsync(Level level)
        {
            await context.Levels.AddAsync(level);
        }

        public async Task<Level> FindByIdAsync(int id)
        {
            return await context.Levels.FindAsync(id);
        }

        public async Task<IEnumerable<Level>> ListAsync()
        {
            return await context.Levels.ToListAsync();
        }

        public void Remove(Level level)
        {
            context.Levels.Remove(level);
        }

        public void Update(Level level)
        {
            context.Levels.Update(level);
        }
    }
}
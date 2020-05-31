using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Persistence.Contexts;

namespace WebRecipes.API.Persistence
{
    public class MarkRepository : BaseRepository, IMarkRepository
    {
        public MarkRepository(AppDbContext context) : base(context)
        {
        }

        public async Task AddAsync(Mark mark)
        {
            await context.Marks.AddAsync(mark);
        }

        public async Task<Mark> FindByIdAsync(int id)
        {
            return await context.Marks.FindAsync(id);
        }

        public async Task<IEnumerable<Mark>> ListAsync()
        {
            return await context.Marks.ToListAsync();
        }

        public void Remove(Mark mark)
        {
            context.Marks.Remove(mark);
        }

        public void Update(Mark mark)
        {
            context.Marks.Update(mark);
        }
    }
}
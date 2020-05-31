using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Persistence.Contexts;

namespace WebRecipes.API.Persistence
{
    public class LikeRepository : BaseRepository, ILikeRepository
    {
        public LikeRepository(AppDbContext context) : base(context)
        {
        }

        public async Task AddAsync(Like like)
        {
            await context.Likes.AddAsync(like);
        }

        public async Task<Like> FindByIdAsync(int id)
        {
            return await context.Likes.FindAsync(id);
        }

        public async Task<IEnumerable<Like>> ListAsync()
        {
            return await context.Likes.ToListAsync();
        }

        public void Remove(Like like)
        {
            context.Likes.Remove(like);
        }

        public void Update(Like like)
        {
            context.Likes.Update(like);
        }
    }
}
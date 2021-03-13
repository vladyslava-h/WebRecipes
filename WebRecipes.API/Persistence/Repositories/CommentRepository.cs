using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Persistence.Contexts;

namespace WebRecipes.API.Persistence
{
    public class CommentRepository : BaseRepository, ICommentRepository
    {
        public CommentRepository(AppDbContext context) : base(context)
        {
        }

        public async Task AddAsync(Comment comment)
        {
            await context.Comments.AddAsync(comment);
        }

        public async Task<Comment> FindByIdAsync(int id)
        {
            return await context.Comments.FindAsync(id);
        }

        public async Task<IEnumerable<Comment>> ListAsync()
        {
            return await context.Comments.ToListAsync();
        }

        public void Remove(Comment comment)
        {
            context.Comments.Remove(comment);
        }

        public void Update(Comment comment)
        {
            context.Comments.Update(comment);
        }
    }
}
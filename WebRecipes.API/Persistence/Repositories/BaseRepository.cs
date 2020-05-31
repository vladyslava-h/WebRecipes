using WebRecipes.API.Persistence.Contexts;

namespace WebRecipes.API.Persistence
{
    public abstract class BaseRepository
    {
        protected readonly AppDbContext context;

        public BaseRepository(AppDbContext context)
        {
            this.context = context;
        }
    }
}
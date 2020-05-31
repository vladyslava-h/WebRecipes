using System.Threading.Tasks;

namespace WebRecipes.API.Domain.Repositories
{
    public interface IUnitOfWork
    {
        Task CompleteAsync();
    }
}
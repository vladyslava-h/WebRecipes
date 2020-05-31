using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Domain.Services
{
    public interface IAuthenticationService
    {
        Task<UserResponse> AuthenticateAsync(string login, string password);
        Task<IEnumerable<User>> ListAsync();
         
    }
}
using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Services.Communication;
using WebRecipes.API.Helpers;

namespace WebRecipes.API.Domain.Services
{
    public interface IRegistrationService
    {
        Task<UserResponse> RegistrateAsync (RegistrationForm tmp_user);
        Task<IEnumerable<User>> ListAsync ();
    }
}
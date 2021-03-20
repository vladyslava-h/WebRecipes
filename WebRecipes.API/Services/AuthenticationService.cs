using System;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Helpers;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services.Communication;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Extensions;
using System.Collections.Generic;

namespace WebRecipes.API.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly AppSettings appSettings;
        private readonly IUserRepository userRepository;
        public AuthenticationService(IOptions<AppSettings> appSettings,
                           IUserRepository userRepository)
        {
            this.appSettings = appSettings.Value;
            this.userRepository = userRepository;
        }
        public async Task<UserResponse> AuthenticateAsync(string email, string password)
        {
            try
            {
            PasswordHasher hasher = new PasswordHasher();
            User user = (await userRepository.ListAsync())
                            .SingleOrDefault(usr => usr.Email == email &&
                             (hasher.VerifyHashedPassword(usr.Password, password) == PasswordVerificationResult.Success));

            if (user == null)
                return new UserResponse("Invalid email or password");

                user.GenerateTokenString(appSettings.Secret, appSettings.TokenExpires);
                user.Password = null;
                return new UserResponse(user);

            }
            catch (Exception ex)
            {
                return new UserResponse("Invalid email or password");
                //return new UserResponse($"An error occured when authenticating user: {ex.Message}");
            }

        }

        public async Task<IEnumerable<User>> ListAsync()
        {
            return await userRepository.ListAsync();
        }
    }
}
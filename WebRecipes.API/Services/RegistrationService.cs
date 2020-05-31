using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Domain.Services.Communication;
using WebRecipes.API.Helpers;

namespace WebRecipes.API.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IUserRepository userRepository;
        private readonly IUnitOfWork unitOfWork;
        public RegistrationService(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            this.userRepository = userRepository;
            this.unitOfWork = unitOfWork;

        }
        public async Task<IEnumerable<User>> ListAsync()
        {
            return await userRepository.ListAsync();
        }

        public async Task<UserResponse> RegistrateAsync(RegistrationForm tmp_user)
        {
            if (string.IsNullOrEmpty(tmp_user.Name))
                return new UserResponse("Name is required");
            if (tmp_user.Name.Any(Char.IsDigit) || tmp_user.Name.Any(Char.IsPunctuation) || tmp_user.Name.Any(Char.IsSymbol))
                return new UserResponse("Please enter a valid name. For example, \"John\"");

            else if (string.IsNullOrEmpty(tmp_user.Username))
                return new UserResponse("Username is required");
            else if ((await userRepository.ListAsync()).Where(usr => usr.Username == tmp_user.Username).Count() != 0)
                return new UserResponse("Username is already in use. Please try another username");
            else if (tmp_user.Username.Contains(' '))
                return new UserResponse("Please enter a valid username. Without spaces");


            else if (string.IsNullOrEmpty(tmp_user.Email))
                return new UserResponse("Email is required");
            else if ((await userRepository.ListAsync()).Where(usr => usr.Email == tmp_user.Email).Count() != 0)
                return new UserResponse("Email is already in use. Please try another email");
            else if (true)
            {
                try
                {
                    MailAddress m = new MailAddress(tmp_user.Email);
                }
                catch { return new UserResponse("Please enter a valid email address. For example, \"john@gmail.com\""); }
            }

            if (string.IsNullOrEmpty(tmp_user.Password))
                return new UserResponse("Password is required");


            var user = new User()
            {
                Name = tmp_user.Name,
                Password = tmp_user.Password,
                Email = tmp_user.Email,
                Role = "User",
                Username = tmp_user.Username

            };

            await userRepository.AddAsync(user);
            await unitOfWork.CompleteAsync();

            return new UserResponse(user);

        }
    }
}
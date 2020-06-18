using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository repository;
        private readonly IUnitOfWork unitOfWork;
        public UserService(IUserRepository repository, IUnitOfWork unitOfWork)
        {
            this.repository = repository;
            this.unitOfWork = unitOfWork;
        }

        public async Task<UserResponse> DeleteAsync(int id)
        {
            var existingItem = await repository.FindByIdAsync(id);
            if (existingItem == null)
                return new UserResponse("User not found");

            try
            {
                repository.Remove(existingItem);
                await unitOfWork.CompleteAsync();

                return new UserResponse(existingItem);
            }
            catch (Exception ex)
            {
                return new UserResponse($"Error while deleting user: {ex.Message}");
            }

        }

        public async Task<IEnumerable<User>> ListAsync()
        {
            return await repository.ListAsync();
        }

        public async Task<UserResponse> SaveAsync(User user)
        {
            try
            {
                await repository.AddAsync(user);
                await unitOfWork.CompleteAsync();

                return new UserResponse(user);
            }
            catch (Exception ex)
            {
                return new UserResponse($"Error occured while saving user: {ex.Message}");
            }
        }

        public async Task<UserResponse> UpdateAsync(int id, User user)
        {
            var existingItem = await repository.FindByIdAsync(id);

            if (existingItem == null)
                return new UserResponse("User not found");

            existingItem.Name = user.Name;
            existingItem.Email = user.Email;
            existingItem.Role = user.Role;
            existingItem.Password = user.Password;

            try
            {
                repository.Update(existingItem);
                await unitOfWork.CompleteAsync();
                return new UserResponse(existingItem);
            }
            catch (Exception ex)
            {
                return new UserResponse($"User update error: {ex.Message}");
            }
        }
    }
}
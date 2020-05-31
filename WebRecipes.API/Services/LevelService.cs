using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Services
{
    public class LevelService : ILevelService
    {
        private readonly ILevelRepository repository;
        private readonly IUnitOfWork unitOfWork;
        public LevelService(ILevelRepository repository, IUnitOfWork unitOfWork)
        {
            this.repository = repository;
            this.unitOfWork = unitOfWork;
        }

        public async Task<LevelResponse> DeleteAsync(int id)
        {
            var existingItem = await repository.FindByIdAsync(id);
            if (existingItem == null)
                return new LevelResponse("Level not found");

            try
            {
                repository.Remove(existingItem);
                await unitOfWork.CompleteAsync();

                return new LevelResponse(existingItem);
            }
            catch (Exception ex)
            {
                return new LevelResponse($"Error while deleting level: {ex.Message}");
            }

        }

        public async Task<IEnumerable<Level>> ListAsync()
        {
            return await repository.ListAsync();
        }

        public async Task<LevelResponse> SaveAsync(Level level)
        {
            try 
            {
                await repository.AddAsync(level);
                await unitOfWork.CompleteAsync();

                return new LevelResponse(level);
            }
            catch (Exception ex)
            {
                return new LevelResponse($"Error occured while saving level: {ex.Message}");
            }
        }

        public async Task<LevelResponse> UpdateAsync(int id, Level level)
        {
            var existingItem  = await repository.FindByIdAsync(id);

            if (existingItem == null)
                return new LevelResponse("Level not found");

            existingItem.Name = level.Name;

            try
            {
                repository.Update(existingItem);
                await unitOfWork.CompleteAsync();
                return new LevelResponse(existingItem);
            }
            catch (Exception ex)
            {
                return new LevelResponse($"Level update error: {ex.Message}");
            }
        }
    }
}
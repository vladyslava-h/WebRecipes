using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Services
{
    public class MealService : IMealService
    {
        private readonly IMealRepository repository;
        private readonly IUnitOfWork unitOfWork;
        public MealService(IMealRepository repository, IUnitOfWork unitOfWork)
        {
            this.repository = repository;
            this.unitOfWork = unitOfWork;
        }

        public async Task<MealResponse> DeleteAsync(int id)
        {
            var existingItem = await repository.FindByIdAsync(id);
            if (existingItem == null)
                return new MealResponse("Meal not found");

            try
            {
                repository.Remove(existingItem);
                await unitOfWork.CompleteAsync();

                return new MealResponse(existingItem);
            }
            catch (Exception ex)
            {
                return new MealResponse($"Error while deleting meal: {ex.Message}");
            }

        }

        public async Task<IEnumerable<Meal>> ListAsync()
        {
            return await repository.ListAsync();
        }

        public async Task<MealResponse> SaveAsync(Meal meal)
        {
            try
            {
                await repository.AddAsync(meal);
                await unitOfWork.CompleteAsync();

                return new MealResponse(meal);
            }
            catch (Exception ex)
            {
                return new MealResponse($"Error occured while saving meal: {ex.Message}");
            }
        }

        public async Task<MealResponse> UpdateAsync(int id, Meal meal)
        {
            var existingItem = await repository.FindByIdAsync(id);

            if (existingItem == null)
                return new MealResponse("Meal not found");

            existingItem.Name = meal.Name;

            try
            {
                repository.Update(existingItem);
                await unitOfWork.CompleteAsync();
                return new MealResponse(existingItem);
            }
            catch (Exception ex)
            {
                return new MealResponse($"Meal update error: {ex.Message}");
            }
        }
    }
}
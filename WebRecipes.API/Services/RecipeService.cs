using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly IRecipeRepository repository;
        private readonly IUnitOfWork unitOfWork;
        public RecipeService(IRecipeRepository repository, IUnitOfWork unitOfWork)
        {
            this.repository = repository;
            this.unitOfWork = unitOfWork;
        }

        public async Task<RecipeResponse> DeleteAsync(int id)
        {
            var existingItem = await repository.FindByIdAsync(id);
            if (existingItem == null)
                return new RecipeResponse("Recipe not found");

            try
            {
                repository.Remove(existingItem);
                await unitOfWork.CompleteAsync();

                return new RecipeResponse(existingItem);
            }
            catch (Exception ex)
            {
                return new RecipeResponse($"Error while deleting recipe: {ex.Message}");
            }

        }

        public async Task<IEnumerable<Recipe>> ListAsync()
        {
            return await repository.ListAsync();
        }

        public async Task<RecipeResponse> SaveAsync(Recipe recipe)
        {
            var new_recipe = new Recipe(){
                Name = recipe.Name,
                MealId = 1000,
                LevelId = 1000,
                CreatorId = recipe.CreatorId,
                Ingredients = recipe.Ingredients,
                Directions = recipe.Directions,
                Photo = recipe.Photo,
                Time = recipe.Time,
                //Mark = recipe.Mark,
                TotalMarks = 1
            };

            try
            {
                await repository.AddAsync(new_recipe);
                await unitOfWork.CompleteAsync();

                return new RecipeResponse(new_recipe);
            }
            catch (Exception ex)
            {
                return new RecipeResponse($"Error occured while saving recipe: {ex.Message}");
            }
        }

        public async Task<RecipeResponse> UpdateAsync(int id, Recipe recipe)
        {
            var existingItem = await repository.FindByIdAsync(id);

            if (existingItem == null)
                return new RecipeResponse("Recipe not found");

            existingItem.Name = recipe.Name;

            try
            {
                repository.Update(existingItem);
                await unitOfWork.CompleteAsync();
                return new RecipeResponse(existingItem);
            }
            catch (Exception ex)
            {
                return new RecipeResponse($"Recipe update error: {ex.Message}");
            }
        }
    }
}
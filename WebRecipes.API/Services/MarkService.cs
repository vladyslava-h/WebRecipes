using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Domain.Services.Communication;

namespace WebRecipes.API.Services
{
    public class MarkService : IMarkService
    {
        private readonly IMarkRepository repository;
        private readonly IUnitOfWork unitOfWork;
        public MarkService(IMarkRepository repository, IUnitOfWork unitOfWork)
        {
            this.repository = repository;
            this.unitOfWork = unitOfWork;
        }

        public async Task<MarkResponse> DeleteAsync(int id)
        {
            var existingItem = await repository.FindByIdAsync(id);
            if (existingItem == null)
                return new MarkResponse("Mark not found");

            try
            {
                repository.Remove(existingItem);
                await unitOfWork.CompleteAsync();

                return new MarkResponse(existingItem);
            }
            catch (Exception ex)
            {
                return new MarkResponse($"Error while deleting mark: {ex.Message}");
            }

        }

        public async Task<IEnumerable<Mark>> ListAsync()
        {
            return await repository.ListAsync();
        }

        public async Task<MarkResponse> SaveAsync(Mark mark)
        {
            try
            {
                await repository.AddAsync(mark);
                await unitOfWork.CompleteAsync();

                return new MarkResponse(mark);
            }
            catch (Exception ex)
            {
                return new MarkResponse($"Error occured while saving mark: {ex.Message}");
            }
        }

        public async Task<MarkResponse> UpdateAsync(int id, Mark mark)
        {
            var existingItem = await repository.FindByIdAsync(id);

            if (existingItem == null)
                return new MarkResponse("Mark not found");

            existingItem.Value = mark.Value;

            try
            {
                repository.Update(existingItem);
                await unitOfWork.CompleteAsync();
                return new MarkResponse(existingItem);
            }
            catch (Exception ex)
            {
                return new MarkResponse($"Mark update error: {ex.Message}");
            }
        }
    }
}
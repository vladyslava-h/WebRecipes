using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Domain.Services.Communication;
using WebRecipes.API.Persistence.Contexts;

namespace WebRecipes.API.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository categoryRepository;
        private readonly IUnitOfWork unitOfWork;
        public CommentService(ICommentRepository categoryRepository, IUnitOfWork unitOfWork)
        {
            this.categoryRepository = categoryRepository;
            this.unitOfWork = unitOfWork;
        }

        public async Task<CommentResponse> DeleteAsync(int id)
        {
            var existingCategory = await categoryRepository.FindByIdAsync(id);
            if (existingCategory == null)
                return new CommentResponse("Comment not found");

            try
            {
                categoryRepository.Remove(existingCategory);
                await unitOfWork.CompleteAsync();

                return new CommentResponse(existingCategory);
            }
            catch (Exception ex)
            {
                return new CommentResponse($"Error when deleting comment: {ex.Message}");
            }

        }

        public async Task<IEnumerable<Comment>> ListAsync()
        {
            return await categoryRepository.ListAsync();
        }

        public async Task<CommentResponse> SaveAsync(Comment category)
        {
            try
            {
                await categoryRepository.AddAsync(category);
                await unitOfWork.CompleteAsync();

                return new CommentResponse(category);
            }
            catch (Exception ex)
            {
                return new CommentResponse($"Error occured when saving comment: {ex.Message}");
            }
        }

        public async Task<CommentResponse> UpdateAsync(int id, Comment category)
        {
            var existingCategory = await categoryRepository.FindByIdAsync(id);

            if (existingCategory == null)
                return new CommentResponse("Category not found");

            //existingCategory.Value = category.Value;

            try
            {
                categoryRepository.Update(existingCategory);
                await unitOfWork.CompleteAsync();
                return new CommentResponse(existingCategory);
            }
            catch (Exception ex)
            {
                return new CommentResponse($"Category update error: {ex.Message}");
            }
        }
    }
}
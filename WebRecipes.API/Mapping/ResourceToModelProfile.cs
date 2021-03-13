using WebRecipes.API.Resources;
using AutoMapper;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Mapping
{
    public class ResourceToModelProfile : Profile
    {
        public ResourceToModelProfile()
        {
            CreateMap<SaveRecipeResource, Recipe>();
            CreateMap<UserResource, User>();
            CreateMap<RecipeResource, Recipe>();
            CreateMap<MealResource, Meal>();
            CreateMap<LevelResource, Level>();
            CreateMap<MarkResource, Mark>();
            CreateMap<CommentResource, Comment>();
        }
    }
}
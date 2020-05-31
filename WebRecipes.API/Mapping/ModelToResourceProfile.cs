using AutoMapper;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Resources;

namespace WebRecipes.API.Mapping
{
    public class ModelToResourceProfile : Profile
    {
        public ModelToResourceProfile()
        {
            CreateMap<Category, CategoryResource>();
            CreateMap<Recipe, RecipeResource>();
            CreateMap<User, UserResource>();
            CreateMap<Level, LevelResource>();
            CreateMap<Meal, MealResource>();
            CreateMap<Mark, MarkResource>();
        }
    }
}
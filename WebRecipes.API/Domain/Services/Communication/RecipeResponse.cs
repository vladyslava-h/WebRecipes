using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Services.Communication
{
    public class RecipeResponse : BaseResponse
    {
        public Recipe Recipe { get; private set; }

        public RecipeResponse(bool success, string message, Recipe recipe) : base(success, message)
        {
            Recipe = recipe;
        }

        public RecipeResponse(Recipe recipe) : this(true, string.Empty, recipe) { }


        public RecipeResponse(string message) : this(false, message, null) { }
    }
}
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Services.Communication
{
    public class MealResponse : BaseResponse
    {
        public Meal Meal { get; private set; }

        public MealResponse(bool success, string message, Meal meal) : base(success, message)
        {
            Meal = meal;
        }

        public MealResponse(Meal meal) : this(true, string.Empty, meal) { }


        public MealResponse(string message) : this(false, message, null) { }
    }
}
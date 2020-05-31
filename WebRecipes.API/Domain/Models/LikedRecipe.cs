using System.ComponentModel.DataAnnotations;

namespace WebRecipes.API.Domain.Models
{
    public class LikedRecipe
    {
        [Key]
        public int Id {set;get;}
        public int UserId {set;get;}
        public int RecipeId {set;get;}
    }
}
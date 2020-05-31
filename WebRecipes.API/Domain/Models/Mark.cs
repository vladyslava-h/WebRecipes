using System.ComponentModel.DataAnnotations;

namespace WebRecipes.API.Domain.Models
{
    public class Mark
    {
        public int Id {set;get;}
        public int Value {set;get;}
        public int RecipeId {set;get;}
        public int UserId {set;get;}
        public Recipe Recipe {set;get;}
        public User User {set;get;}
    }
}
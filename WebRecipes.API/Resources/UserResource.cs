using System.Collections.Generic;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Resources
{
    public class UserResource : IResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { set; get; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Username { set; get; }
        public int Subscribers { set; get; }
        public int  RecipesCount { set; get; }
        public string Photo { set; get; }
        public IEnumerable<RecipeResource> Recipes {set;get;}
        //        public ICollection<Recipe> LikedRecipes { get; set; } = new List<Recipe>();
        //      public ICollection<Mark> Marks { set; get; } = new List<Mark>();
        public string Token { get; set; }
    }
}
using System.Collections.Generic;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Resources
{
    public class RecipeResource : IResource
    {
        public int Id { set; get; }
        public int MealId { set; get; }
        public int LevelId { set; get; }
        public string Name { set; get; }
        public string Meal { set; get; }
        public int UserMark { set; get; }
        public string Level { set; get; }
        public string Ingredients { set; get; }
        public string Directions { set; get; }
        public int TotalMarks { set; get; }
        public bool IsLiked { set; get; }
        public double Mark { set; get; }
        public string Time { set; get; }
        public string Photo { set; get; }
        public int CreatorId { set; get; }
        public User User {set;get;}
    }
}
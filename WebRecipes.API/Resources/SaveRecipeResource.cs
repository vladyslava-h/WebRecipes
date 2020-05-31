using System.ComponentModel.DataAnnotations;

namespace WebRecipes.API.Resources
{
    public class SaveRecipeResource : IResource
    {
        public int Id { set; get; }
        public int MealId { set; get; }
        public int LevelId { set; get; }
        public string Name { set; get; }
        public string Username { set; get; }
        public string Ingredients { set; get; }
        public string Directions { set; get; }
        public int TotalMarks { set; get; }
        public bool IsLiked { set; get; }
        public double Mark { set; get; }
        public string Time { set; get; }
        public string Photo { set; get; }
        public int CreatorId { set; get; }
    }
}
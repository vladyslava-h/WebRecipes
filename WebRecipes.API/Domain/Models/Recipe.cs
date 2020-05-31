using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebRecipes.API.Domain.Models
{
    public class Recipe
    {
        public int Id { set; get; }
        public int MealId { set; get; }
        public int LevelId { set; get; }
        public string Name { set; get; }
        public string Ingredients { set; get; }
        public string Directions { set; get; }
        public int TotalMarks { set; get; }
        public double Mark { set; get; }
        public string Time { set; get; }
        public string Photo { set; get; }
        public int CreatorId { set; get; }
    }
}
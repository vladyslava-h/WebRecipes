using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebRecipes.API.Domain.Models
{
    public class Meal
    {
        [Key]
        public int Id{set;get;}
        public string Name {set;get;}
        public IList<Recipe> Recipes { get; set; } = new List<Recipe>();
    }
}
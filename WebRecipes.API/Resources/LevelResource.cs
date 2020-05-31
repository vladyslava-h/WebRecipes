using System.Collections.Generic;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Resources
{
    public class LevelResource : IResource
    {
        public int Id { set; get; }
        public string Name { set; get; }
        public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    }
}
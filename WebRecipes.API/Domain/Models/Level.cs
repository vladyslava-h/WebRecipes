using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebRecipes.API.Domain.Models
{
    public class Level
    {
        //[Key]
        public int Id {set;get;}
        public string Name {set;get;}
        [NotMapped]
        public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    }
}
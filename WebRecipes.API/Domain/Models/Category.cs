using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebRecipes.API.Domain.Models
{
    public class Category
    {
        //[Key]
        public int Id{set;get;}
        public string Name {set;get;}
        public int NumberOfSearch {set;get;}
        //[NotMapped]
    }
}
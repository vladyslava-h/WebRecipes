using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Resources
{
    public class CategoryResource : IResource
    {
        public int Id { set; get; }
        public string Name { set; get; }
        public int NumberOfSearch { set; get; }
        //[NotMapped]
    }
}
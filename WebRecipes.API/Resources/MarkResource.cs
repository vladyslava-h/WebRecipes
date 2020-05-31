using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Resources
{
    public class MarkResource : IResource
    {
        public int Id {set;get;}
        public int Value {set;get;}
        public Recipe Recipe {set;get;}
        public User User {set;get;}
    }
}
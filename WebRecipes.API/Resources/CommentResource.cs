using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Resources
{
    public class CommentResource : IResource
    {
        public int Id {set;get;}
        public int RecipeId {set;get;}
        public int UserId {set;get;}
        public string Value {set;get;}
        public User User {set; get;}
        //[NotMapped]
    }
}
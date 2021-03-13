using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebRecipes.API.Domain.Models
{
    public class Comment
    {
        public int Id {set;get;}
        public int RecipeId {set;get;}
        public int UserId {set;get;}
        public string Value {set;get;}
    }
}
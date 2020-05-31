using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebRecipes.API.Domain.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email {set;get;}
        public string Password { get; set; }
        public string Role { get; set; }
        public string Username { get; set; }
        //public ICollection<Recipe> UsersRecipes { get; set; } = new List<Recipe>();
        //public ICollection<Recipe> LikedRecipes { get; set; } = new List<Recipe>();
        //public ICollection<Mark> Marks {set;get;} = new List<Mark>();
        //public ICollection<ContentCreator> Subscriptions {set;get;} = new List<ContentCreator>();
        
        [NotMapped]
        public string Token { get; set; }
    }
}
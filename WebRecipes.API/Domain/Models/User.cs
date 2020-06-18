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
        public string Photo {set;get;}
        
        [NotMapped]
        public string Token { get; set; }
    }
}
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace WebRecipes.API.Helpers
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public int TokenExpires { get;set; }
    }
}
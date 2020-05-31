namespace WebRecipes.API.Domain.Models
{
    public class Subscription
    {
        public int Id {set;get;}
        public string CreatorUsername {set;get;}
        public string SubscriberUsername {set;get;}
    }
}
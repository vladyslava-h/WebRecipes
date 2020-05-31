using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Services.Communication
{
    public class MarkResponse : BaseResponse
    {
        public Mark Mark { get; private set; }

        public MarkResponse(bool success, string message, Mark mark) : base(success, message)
        {
            Mark = mark;
        }

        public MarkResponse(Mark mark) : this(true, string.Empty, mark) { }


        public MarkResponse(string message) : this(false, message, null) { }
    }
}
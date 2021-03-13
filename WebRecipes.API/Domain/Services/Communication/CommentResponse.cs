using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Services.Communication
{
    public class CommentResponse : BaseResponse
    {
        public Comment Comment { get; private set; }

        public CommentResponse(bool success, string message, Comment comment) : base(success, message)
        {
            Comment = comment;
        }

        public CommentResponse(Comment comment) : this(true, string.Empty, comment) { }


        public CommentResponse(string message) : this(false, message, null) { }
    }
}
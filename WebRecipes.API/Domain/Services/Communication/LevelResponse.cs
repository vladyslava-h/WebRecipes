using WebRecipes.API.Domain.Models;

namespace WebRecipes.API.Domain.Services.Communication
{
    public class LevelResponse : BaseResponse
    {
        public Level Level { get; private set; }

        public LevelResponse(bool success, string message, Level level) : base(success, message)
        {
            Level = level;
        }

        public LevelResponse(Level level) : this(true, string.Empty, level) { }


        public LevelResponse(string message) : this(false, message, null) { }
    }
}
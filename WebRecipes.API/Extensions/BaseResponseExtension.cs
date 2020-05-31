using WebRecipes.API.Domain.Services.Communication;
using WebRecipes.API.Resources;

namespace WebRecipes.API.Extensions
{
    public static class BaseResponseExtension
    {
        public static ResponseResult GetResponseResult<T>(this T response, IResource resource) where T: BaseResponse 
        {
            return new ResponseResult
            {
                Data = resource,
                Message = response.Message,
                Success = response.Success
            };
        }
    }
}
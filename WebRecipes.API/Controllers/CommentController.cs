using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Resources;

namespace WebRecipes.API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CommentController : Controller
    {
        private readonly ICommentService commentService;
        private readonly IRecipeService recipeService;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;
        public CommentController(ICommentService service, IMapper mapper, IRecipeService recipeService, IUserRepository userRepository)
        {
            this.mapper = mapper;
            this.commentService = service;
            this.recipeService = recipeService;
            this.userRepository = userRepository;
        }

        //[Authorize(Roles = "Admin, User")]
        [HttpGet("all/{id}")]
        public async Task<IActionResult> GetAll(int id)
        {
            var comments = (await commentService.ListAsync()).Where(x => x.RecipeId == id);
            var users = (await userRepository.ListAsync());
            var resources = mapper.Map<IEnumerable<Comment>, IEnumerable<CommentResource>>(comments);

            resources.ToList().ForEach(x => {
                try
                {

                    var user = users.Where(u => u.Id == x.UserId).FirstOrDefault();
                    x.User = new User()
                    {
                        Photo = user.Photo,
                        Username = user.Username
                    };
                }
                catch{}
            });

            return Ok(new ResponseResult() { Data = resources, Success = true });
        }

        [HttpPost("comment/{id}")]
        public async Task<IActionResult> PostComment(int id, string username, string value)
        {
            var users = (await userRepository.ListAsync());
            var current_user = users.Where(x => x.Username == username).FirstOrDefault();

            await commentService.SaveAsync(new Comment()
            {
                UserId = current_user.Id,
                RecipeId = id,
                Value = value
            });

            var comments = (await commentService.ListAsync()).Where(x => x.RecipeId == id);
            var resources = mapper.Map<IEnumerable<Comment>, IEnumerable<CommentResource>>(comments);

            resources.ToList().ForEach(x => {
                try
                {

                    var user = users.Where(u => u.Id == x.UserId).FirstOrDefault();
                    x.User = new User()
                    {
                        Photo = user.Photo,
                        Username = user.Username
                    };
                }
                catch{}
            });
            return Ok(new ResponseResult() { Data = resources, Success = true});
        }
    }
}
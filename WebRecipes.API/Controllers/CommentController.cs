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
        private readonly IMapper mapper;
        public CommentController(ICommentService service, IMapper mapper)
        {
            this.mapper = mapper;
            commentService = service;
        }

        //[Authorize(Roles = "Admin, User")]
        [HttpGet]
        public async Task<IActionResult> GetAll(int recipe)
        {
            var comments = (await commentService.ListAsync()).Where(x => x.RecipeId == recipe);
            var resources = mapper.Map<IEnumerable<Comment>, IEnumerable<CommentResource>>(comments);

            return Ok(new ResponseResult() { Data = resources, Success = true });
        }
    }
}
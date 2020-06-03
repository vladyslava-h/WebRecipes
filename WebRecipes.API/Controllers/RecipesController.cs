using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Extensions;
using WebRecipes.API.Resources;

namespace WebRecipes.API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class RecipesController : Controller
    {
        private readonly IRecipeService recipeService;
        private readonly IUserRepository userRepository;
        private readonly ILikeRepository likeRepository;
        private readonly IMapper mapper;

        public RecipesController(IRecipeService recipeService, ILikeRepository likeRepository,
         IMapper mapper, IUserRepository userRepository)
        {
            this.recipeService = recipeService;
            this.userRepository = userRepository;
            this.likeRepository = likeRepository;
            this.mapper = mapper;
        }

        [Authorize(Roles = "User, Admin")]
        [Route("create")]
        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] SaveRecipeResource resource)
        {
            resource.CreatorId = (await userRepository.ListAsync())
                                 .First(x => x.Username == resource.Username).Id;
            var recipe = mapper.Map<SaveRecipeResource, Recipe>(resource);
            var result = await recipeService.SaveAsync(recipe);

            if (!result.Success)
                return BadRequest(result.Message);

            var recipeResource = mapper.Map<Recipe, RecipeResource>(result.Recipe);
            return Ok(recipeResource);

        }

        [Authorize(Roles = "User,Admin")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveRecipeResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var recipe = mapper.Map<SaveRecipeResource, Recipe>(resource);
            var recipeResponse = await recipeService.UpdateAsync(id, recipe);
            var recipeResource = mapper.Map<Recipe, RecipeResource>(recipeResponse.Recipe);
            var result = recipeResponse.GetResponseResult(recipeResource);
            return Ok(result);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllAsync(int? level, int? meal, string username)
        {
            var users = (await userRepository.ListAsync());
            var likes = (await likeRepository.ListAsync()).Where(x => x.Username == username).Select(x => x.RecipeId);
            IEnumerable<Recipe> recipes = (await recipeService.ListAsync());

            if (level == null && meal != null)
                recipes = recipes.Where(x => x.MealId == meal);
            if (meal == null && level != null)
                recipes = recipes.Where(x => x.LevelId == level);

            var resources = mapper.Map<IEnumerable<Recipe>, IEnumerable<RecipeResource>>(recipes);
            resources.ToList().ForEach(x => x.User = users.SingleOrDefault(u => u.Id == x.CreatorId));
            resources.ToList().ForEach(x => x.IsLiked = likes.Contains(x.Id));
            return Ok(new ResponseResult() { Data = resources, Success = true });
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet("search/{item}")]
        public async Task<IActionResult> SearchAsync(string item, int? level, int? meal, string username)
        {
            var users = (await userRepository.ListAsync());
            var likes = (await likeRepository.ListAsync()).Where(x => x.Username == username).Select(x => x.RecipeId);
            IEnumerable<Recipe> recipes = (await recipeService.ListAsync());

            if (level == null && meal != null)
                recipes = recipes.Where(x => x.MealId == meal);
            if (meal == null && level != null)
                recipes = recipes.Where(x => x.LevelId == level);

            var resources = mapper.Map<IEnumerable<Recipe>, IEnumerable<RecipeResource>>(recipes);
            resources.ToList().ForEach(x => x.User = users.SingleOrDefault(u => u.Id == x.CreatorId));
            resources.ToList().ForEach(x => x.IsLiked = likes.Contains(x.Id));
            return Ok(new ResponseResult() { Data = resources.Where(x => x.Name.Contains(item)), Success = true });
        }
    }
}
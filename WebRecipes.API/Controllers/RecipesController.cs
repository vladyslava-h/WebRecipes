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
using System;

namespace WebRecipes.API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class RecipesController : Controller
    {
        private readonly IRecipeService recipeService;
        private readonly IUserRepository userRepository;
        private readonly ILikeRepository likeRepository;
        private readonly IMealService mealService;
         private readonly ILevelService levelService;
         private readonly IMarkService markService;
        private readonly IMapper mapper;

        private int pageSize = 12;


        public RecipesController(IRecipeService recipeService, ILikeRepository likeRepository, IMarkService markService,
         IMapper mapper, IUserRepository userRepository, IMealService mealService, ILevelService levelService)
        {
            this.recipeService = recipeService;
            this.userRepository = userRepository;
            this.likeRepository = likeRepository;
            this.levelService = levelService;
            this.mealService = mealService;
            this.markService = markService;
            this.mapper = mapper;
        }

        //[Authorize(Roles = "User, Admin")]
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

        //[Authorize(Roles = "User,Admin")]
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

        //[Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllAsync(int? level, int? meal, string username, int page = 1)
        {
            var users = (await userRepository.ListAsync());
            var likes = (await likeRepository.ListAsync()).Where(x => x.Username == username).Select(x => x.RecipeId);
            IEnumerable<Recipe> recipes = (await recipeService.ListAsync());

            if (level == null && meal != null)
                recipes = recipes.Where(x => x.MealId == meal);
            if (meal == null && level != null)
                recipes = recipes.Where(x => x.LevelId == level);

            var resources = mapper.Map<IEnumerable<Recipe>, IEnumerable<RecipeResource>>(recipes);

            double pages = resources.Count() / pageSize;
            if (resources.Count() == pageSize)
            {
                pages = 0;
            }
            resources = resources.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            resources.ToList().ForEach(x => x.User = users.SingleOrDefault(u => u.Id == x.CreatorId));
            resources.ToList().ForEach(x => x.IsLiked = likes.Contains(x.Id));

            for(var i = 0; i < resources.Count(); i++)
            {
                try
                {
                    var marks = (await markService.ListAsync()).Where(x => x.RecipeId == resources.ElementAt(i).Id);
                    var marksSum = marks.Sum(x => x.Value);
                    var totalMarks = marks.Count();

                    resources.ElementAt(i).Mark = marksSum;
                    resources.ElementAt(i).TotalMarks = totalMarks;
                }
                catch
                {
                    resources.ElementAt(i).Mark = 0;
                    resources.ElementAt(i).TotalMarks = 0;
                }
            }

            return Ok(new ResponseResult() { Data = resources, Pages = Convert.ToInt32(Math.Ceiling(pages)), Success = true });
        }


        [HttpGet("getrecipe/{id}")]
        public async Task<IActionResult> GetRecipe(int id, string username)
        {
            Recipe recipe = (await recipeService.ListAsync()).Where(x => x.Id == id).FirstOrDefault();
            User creator = (await userRepository.ListAsync()).Where(x => x.Id == recipe.CreatorId).FirstOrDefault();
            User user = (await userRepository.ListAsync()).Where(x => x.Username == username).FirstOrDefault();
            Mark mark = (await markService.ListAsync()).Where(x => x.UserId == user.Id && x.RecipeId == id).FirstOrDefault();
            var marks = (await markService.ListAsync()).Where(x => x.RecipeId == id);

            var meals = await mealService.ListAsync();
            var isLiked = (await likeRepository.ListAsync()).Where(x => x.Username == username && x.RecipeId == id).Count() > 0 ? true : false;

            var resources = mapper.Map<Recipe, RecipeResource>(recipe);
            resources.User = new User(){
                Username = creator.Username
            };
            resources.IsLiked = isLiked;
            resources.UserMark = mark == null ? 0 : mark.Value;
            resources.Meal = (await mealService.ListAsync()).Where(x => x.Id == recipe.MealId).FirstOrDefault().Name;
            resources.Level = (await levelService.ListAsync()).Where(x => x.Id == recipe.LevelId).FirstOrDefault().Name;

            try{
                var marksSum = marks.Sum(x => x.Value); 
                var totalMarks = marks.Count(); 

                resources.Mark = marksSum;
                resources.TotalMarks = totalMarks;
            }
            catch{
                resources.Mark = 0;
                resources.TotalMarks = 0;
            }

            return Ok(new ResponseResult() { Data = resources, Success = true });
        }

        //[Authorize(Roles = "User,Admin")
        [HttpGet("search/{item}")]
        public async Task<IActionResult> SearchAsync(string item, int? level, int? meal, string username, int page = 1)
        {
            var users = (await userRepository.ListAsync());
            var likes = (await likeRepository.ListAsync()).Where(x => x.Username == username).Select(x => x.RecipeId);
            IEnumerable<Recipe> recipes = (await recipeService.ListAsync());

            if (level == null && meal != null)
                recipes = recipes.Where(x => x.MealId == meal);
            if (meal == null && level != null)
                recipes = recipes.Where(x => x.LevelId == level);

            var resources = mapper.Map<IEnumerable<Recipe>, IEnumerable<RecipeResource>>(recipes).Where(x => x.Name.ToLower().Contains(item.ToLower()));

            double pages = resources.Count() / pageSize;
            if (resources.Count() == pageSize)
            {
                pages = 0;
            }
            resources = resources.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            resources.ToList().ForEach(x => x.User = users.SingleOrDefault(u => u.Id == x.CreatorId));
            resources.ToList().ForEach(x => x.IsLiked = likes.Contains(x.Id));

            for(var i = 0; i < resources.Count(); i++)
            {
                try
                {
                    var marks = (await markService.ListAsync()).Where(x => x.RecipeId == resources.ElementAt(i).Id);
                    var marksSum = marks.Sum(x => x.Value);
                    var totalMarks = marks.Count();

                    resources.ElementAt(i).Mark = marksSum;
                    resources.ElementAt(i).TotalMarks = totalMarks;
                }
                catch
                {
                    resources.ElementAt(i).Mark = 0;
                    resources.ElementAt(i).TotalMarks = 0;
                }
            }

            return Ok(new ResponseResult() { Data = resources,
             Pages = Convert.ToInt32(Math.Ceiling(pages)), Success = true });
        }

        [HttpPost("rate/{id}")]
        public async Task<IActionResult> Rate(int id, string username, int value, int prev)
        {
            var user = (await userRepository.ListAsync()).Where(x => x.Username == username).FirstOrDefault();   
            var mark23 = (await markService.ListAsync());
            Mark mark = (await markService.ListAsync()).Where(x => x.UserId == user.Id && x.RecipeId == id).FirstOrDefault();

            if(mark == null){
                await markService.SaveAsync(new Mark()
                {
                    UserId = user.Id,
                    RecipeId = id,
                    Value = value
                });
            }
            else{
                await markService.UpdateAsync(mark.Id, new Mark(){
                    Value = value      
                });
            }

            var marks = (await markService.ListAsync()).Where(x => x.RecipeId == id);
            return Ok(new ResponseResult() { Data = new {mark = marks.Sum(x => x.Value), totalMarks = marks.Count()}, Success = true});
        }
    }
}
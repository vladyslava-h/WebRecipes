using System.Runtime.CompilerServices;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Resources;
using System.Linq;
using WebRecipes.API.Helpers;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Extensions;

namespace WebRecipes.API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UserController : Controller
    {
        private readonly IUserService userService;
        private readonly IRecipeService recipeService;
        private readonly ISubscriptionRepository subscriptionRepository;
        private readonly ILikeRepository likeRepository;
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;
        private int pageSize = 12;


        public UserController(IUserService userService, IMapper mapper, IRecipeService recipeService,
         ISubscriptionRepository subscription, IUnitOfWork unitOfWork, ILikeRepository likeRepository)
        {
            this.subscriptionRepository = subscription;
            this.recipeService = recipeService;
            this.userService = userService;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            this.likeRepository = likeRepository;
        }

        //[Authorize(Roles = "User,Admin")]
        [HttpGet]
        [Route("{username}/home")]
        public async Task<IActionResult> GetHomeRecipesAsync(string username, int page = 1)
        {
            var subscriptions = (await subscriptionRepository.ListAsync()).Where(x => x.SubscriberUsername == username).Select(x => x.CreatorUsername);
            var users = (await userService.ListAsync()).Where(x => subscriptions.Contains(x.Username));
            var usersId = users.Select(x => x.Id);

            var recipes = new List<Recipe>();

            //getting recipes [from new to old]
            foreach (var recipe in (await recipeService.ListAsync()).Reverse())
            {
                if (usersId.Contains(recipe.CreatorId))
                    recipes.Add(recipe);
            }

            var resources = mapper.Map<IEnumerable<Recipe>, IEnumerable<RecipeResource>>(recipes);

            double pages = resources.Count() / pageSize;
            if (resources.Count() == pageSize)
            {
                pages = 0;
            }
            resources = resources.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var likes = (await likeRepository.ListAsync()).Where(x => x.Username == username).Select(x => x.RecipeId);
            resources.ToList().ForEach(x => x.User = users.FirstOrDefault(u => u.Id == x.CreatorId));
            resources.ToList().ForEach(x => x.IsLiked = likes.Contains(x.Id));

            
            return Ok(new ResponseResult() { Data = resources, Pages = Convert.ToInt32(Math.Ceiling(pages)) });
        }

        //[Authorize(Roles = "User,Admin")]
        [HttpGet]
        [Route("{username}/recipes")]
        public async Task<IActionResult> GetRecipesAsync(string username, int page = 1)
        {
            var all = (await userService.ListAsync());
            var user = (await userService.ListAsync()).SingleOrDefault(x => x.Username == username);

            var recipes = (await recipeService.ListAsync()).Where(x => x.CreatorId == user.Id);
            var resources = mapper.Map<IEnumerable<Recipe>, IEnumerable<RecipeResource>>(recipes);

            resources.ToList().ForEach(x => x.User = user);

            double pages = resources.Count() / pageSize;
            if (resources.Count() == pageSize)
            {
                pages = 0;
            }
            resources = resources.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return Ok(new ResponseResult() { Data = resources, Pages = Convert.ToInt32(Math.Ceiling(pages)) });
        }

        //[Authorize(Roles = "User,Admin")]
        [HttpGet]
        [Route("{username}/info")]
        public async Task<IActionResult> GetUserAsync(string username, int page = 1)
        {
            var user = (await userService.ListAsync()).SingleOrDefault(x => x.Username == username);
            var subscribers = (await subscriptionRepository.ListAsync());
            var recipes = (await recipeService.ListAsync()).Where(x => x.CreatorId == user.Id);

            var resources = mapper.Map<User, UserResource>(user);
            resources.Subscribers = subscribers.Where(x => x.CreatorUsername == user.Username).Count();
            resources.RecipesCount = recipes.Count();
            resources.Password = null;

            var resourcesRecipes = mapper.Map<IEnumerable<Recipe>, IEnumerable<RecipeResource>>(recipes);
            foreach (var recipe in resourcesRecipes)
            {
                recipe.User = user;
            }

            double pages = resourcesRecipes.Count() / pageSize;
            if (resourcesRecipes.Count() == pageSize)
            {
                pages = 0;
            }
            resourcesRecipes = resourcesRecipes.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            resources.Recipes = resourcesRecipes;
            return Ok(new ResponseResult() { Data = resources, Success = true, Pages = Convert.ToInt32(Math.Ceiling(pages))});
        }

        //[Authorize(Roles = "User,Admin")]
        [HttpGet]
        [Route("{username}/subscriptions")]
        public async Task<IActionResult> GetSubscriptionsAsync(string username)
        {
            var user = (await userService.ListAsync()).SingleOrDefault(x => x.Username == username);
            var subscriptions = (await subscriptionRepository.ListAsync()).Where(x => x.SubscriberUsername == username).Select(x => x.CreatorUsername);

            return Ok(new ResponseResult() { Data = subscriptions, Success = true });
        }

        //[Authorize(Roles = "User,Admin")]
        [HttpGet]
        [Route("{username}/favourites")]
        public async Task<IActionResult> GetFavouriteRecipesAsync(string username, int page = 1)
        {
            var users = (await userService.ListAsync());
            var likes = (await likeRepository.ListAsync()).Where(x => x.Username == username).Select(x => x.RecipeId);
            var recipes = (await recipeService.ListAsync()).Where(x => likes.Contains(x.Id));

            var resources = mapper.Map<IEnumerable<Recipe>, IEnumerable<RecipeResource>>(recipes);
            double pages = resources.Count() / pageSize;
            if(resources.Count() == pageSize){
                pages = 0;
            }
            resources = resources.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            resources.ToList().ForEach(x => x.User = users.SingleOrDefault(u => u.Id == x.CreatorId));
            resources.ToList().ForEach(x => x.IsLiked = likes.Contains(x.Id));
            return Ok(new ResponseResult() { Data = resources, Success = true, Pages = Convert.ToInt32(Math.Ceiling(pages)) });
        }

        //[Authorize(Roles = "User, Admin")]
        [HttpDelete]
        [Route("{username}/recipe")]
        public async Task<IActionResult> DeleteRecipeAsync(string username, int id)
        {
            var result = await recipeService.DeleteAsync(id);

            if (!result.Success)
                return BadRequest(result.Message);

            var resource = mapper.Map<Recipe, RecipeResource>(result.Recipe);
            return Ok(recipeService);
        }

        //[Authorize(Roles = "User, Admin")]
        [HttpDelete]
        [Route("{username}/unlike")]
        public async Task<IActionResult> DeleteLikeAsync(string username, int id)
        {
            var like = (await likeRepository.ListAsync()).Where(x => x.Username == username && x.RecipeId == id).SingleOrDefault();
            likeRepository.Remove(like);
            await unitOfWork.CompleteAsync();

            return Ok(recipeService);
        }

        //[Authorize(Roles = "User, Admin")]
        [HttpPost]
        [Route("{username}/like")]
        public async Task<IActionResult> LikeAsync(string username, int id)
        {
            await likeRepository.AddAsync(new Like() { RecipeId = id, Username = username });
            await unitOfWork.CompleteAsync();

            return Ok(recipeService);
        }

        //[Authorize(Roles = "User, Admin")]
        [HttpPost]
        [Route("{username}/subscribe")]
        public async Task<IActionResult> SubscribeAsync(string username, string creator)
        {
            if ((await subscriptionRepository.ListAsync()).Where(x =>
                x.SubscriberUsername == username && x.CreatorUsername == creator).Count() > 0)
                return Ok(recipeService);

            await subscriptionRepository.AddAsync(new Subscription() { SubscriberUsername = username, CreatorUsername = creator });
            await unitOfWork.CompleteAsync();

            return Ok(recipeService);
        }

        //[Authorize(Roles = "User, Admin")]
        [HttpDelete]
        [Route("{username}/unsubscribe")]
        public async Task<IActionResult> DeleteSubscriptionAsync(string username, string creator)
        {
            var user = (await userService.ListAsync()).SingleOrDefault(x => x.Username == username);
            var subscription = (await subscriptionRepository.ListAsync())
            .Where(x => x.SubscriberUsername == username && x.CreatorUsername == creator).SingleOrDefault();

            subscriptionRepository.Remove(subscription);
            await unitOfWork.CompleteAsync();
            return Ok(userService);
        }

        //[Authorize(Roles = "User,Admin")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> PutAsync(int id, [FromBody] UserResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var user = mapper.Map<UserResource, User>(resource);
            var userResponse = await userService.UpdateAsync(id, user);
            var userResource = mapper.Map<User, UserResource>(userResponse.User);
            var result = userResponse.GetResponseResult(userResource);
            return Ok(result);
        }

    }
}
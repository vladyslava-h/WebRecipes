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
    public class UsersController : Controller
    {
        private readonly IUserService userService;
        private readonly IRecipeService recipeService;
        private readonly ISubscriptionRepository subscriptionRepository;
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;

        public UsersController(IUserService userService, IMapper mapper, IRecipeService recipeService,
        ISubscriptionRepository subscription, IUnitOfWork unitOfWork)
        {
            this.subscriptionRepository = subscription;
            this.recipeService = recipeService;
            this.userService = userService;
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("statistic")]
        public async Task<IActionResult> GetStatisticAsync()
        {
            var subscriptions = (await subscriptionRepository.ListAsync());
            var users = (await userService.ListAsync());
            var recipes = (await recipeService.ListAsync());

            var resources = mapper.Map<IEnumerable<User>, IEnumerable<UserResource>>(users);

            foreach (var user in resources)
            {
                user.Subscribers = subscriptions.Where(x => x.CreatorUsername == user.Username).Count();
                user.RecipesCount = recipes.Where(x => x.CreatorId == user.Id).Count();
            }
            resources = resources.OrderByDescending(x => x.Subscribers);
            return Ok(new ResponseResult() { Data = resources, Success = true });
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet]
        [Route("top")]
        public async Task<IActionResult> GetTopUsersAsync()
        {
            var subscriptions = (await subscriptionRepository.ListAsync());
            var users = (await userService.ListAsync());

            var resources = mapper.Map<IEnumerable<User>, IEnumerable<UserResource>>(users);

            foreach (var user in resources)
            {
                user.Subscribers = subscriptions.Where(x => x.CreatorUsername == user.Username).Count();
            }
            resources = resources.OrderByDescending(x => x.Subscribers).Take(5);
            return Ok(new ResponseResult() { Data = resources, Success = true });
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet]
        [Route("search/{item}")]
        public async Task<IActionResult> SearchAsync(string item)
        {
            var users = (await userService.ListAsync()).Where(x => x.Username.ToLower().Contains(item.ToLower()));
            var resources = mapper.Map<IEnumerable<User>, IEnumerable<UserResource>>(users);
            return Ok(new ResponseResult() { Data = resources, Success = true });
        }

        [Authorize(Roles = "User, Admin")]
        [HttpDelete]
        [Route("remove")]
        public async Task<IActionResult> DeleteRecipeAsync(int id)
        {
            var user = (await userService.ListAsync()).FirstOrDefault(x => x.Id == id);
            var result = await userService.DeleteAsync(id);
            if (!result.Success)
                return BadRequest(result.Message);

            var recipes = (await recipeService.ListAsync()).Where(x => x.CreatorId == id);
            var subscriptions = (await subscriptionRepository.ListAsync()).Where(x => x.CreatorUsername == user.Username || x.SubscriberUsername == user.Username);
            foreach (var sub in subscriptions)
            {
                subscriptionRepository.Remove(sub);
            }

            foreach (var recipe in recipes)
            {
                await recipeService.DeleteAsync(recipe.Id);
            }

            await unitOfWork.CompleteAsync();

            var resource = mapper.Map<User, UserResource>(result.User);
            return Ok(userService);
        }
    }
}
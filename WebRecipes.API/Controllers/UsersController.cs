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

        public UsersController(IUserService userService, IMapper mapper, IRecipeService recipeService, ISubscriptionRepository subscription)
        {
            this.subscriptionRepository = subscription;
            this.recipeService = recipeService;
            this.userService = userService;
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
            var users = (await userService.ListAsync()).Where(x => x.Username.Contains(item));
            var resources = mapper.Map<IEnumerable<User>, IEnumerable<UserResource>>(users);
            return Ok(new ResponseResult() { Data = resources, Success = true });
        }

        [Authorize(Roles = "User, Admin")]
        [HttpDelete]
        [Route("remove")]
        public async Task<IActionResult> DeleteRecipeAsync(int id)
        {
            var result = await userService.DeleteAsync(id);

            if (!result.Success)
                return BadRequest(result.Message);

            var resource = mapper.Map<User, UserResource>(result.User);
            return Ok(userService);
        }
    }
}
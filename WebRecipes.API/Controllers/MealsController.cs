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
    public class MealsController : Controller
    {
        private readonly IMealService mealService;
        private readonly IMapper mapper;
        public MealsController(IMealService service, IMapper mapper)
        {
            this.mapper = mapper;
            mealService = service;
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var meals = await mealService.ListAsync();
            var resources = mapper.Map<IEnumerable<Meal>, IEnumerable<MealResource>>(meals);

            return Ok(new ResponseResult() { Data = resources, Success = true });
        }
    }
}
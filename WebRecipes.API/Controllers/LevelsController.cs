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
    public class LevelsController : Controller
    {
        private readonly ILevelService levelService;
        private readonly IMapper mapper;
        public LevelsController(ILevelService service, IMapper mapper)
        {
            this.mapper = mapper;
            levelService = service;
        }

        [Authorize(Roles = "Admin, User")]
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var levels = await levelService.ListAsync();
            var resources = mapper.Map<IEnumerable<Level>, IEnumerable<LevelResource>>(levels);

            return Ok(new ResponseResult() { Data = resources, Success = true });
        }
    }
}
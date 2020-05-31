using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebRecipes.API.Domain.Models;
using WebRecipes.API.Domain.Repositories;
using WebRecipes.API.Domain.Services;
using WebRecipes.API.Extensions;
using WebRecipes.API.Helpers;
using WebRecipes.API.Resources;

namespace WebRecipes.API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class AccountController : Controller
    {
        private readonly IAuthenticationService authenticationService;
        private readonly IRegistrationService registrationService;
        private readonly IMapper mapper;
        public AccountController(IAuthenticationService authenticationService, IMapper mapper,
         IRegistrationService registrationService)
        {
            this.authenticationService = authenticationService;
            this.registrationService = registrationService;
            this.mapper = mapper;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User user)
        {
            var authenticatedUser = await authenticationService.AuthenticateAsync(user.Email, user.Password);
            var userResource = mapper.Map<User, UserResource>(authenticatedUser.User);
            var result = authenticatedUser.GetResponseResult(userResource);
            if (result.Success)
                return Ok(result);
            return NotFound(result);
        }

        public async Task<IActionResult> AuthenticateNewUser(User user)
        {
            var authenticatedUser = await authenticationService.AuthenticateAsync(user.Email, user.Password);
            var userResource = mapper.Map<User, UserResource>(authenticatedUser.User);
            var result = authenticatedUser.GetResponseResult(userResource);
            if (result.Success)
                return Ok(result);
            return NotFound(result);
        }

        [HttpPost("registration")]
        public async Task<IActionResult> Registration([FromBody] RegistrationForm user)
        {
            var newuser = await registrationService.RegistrateAsync(user);
            if (newuser.Success)
                return await AuthenticateNewUser(newuser.User);

            var userResource = mapper.Map<User, UserResource>(newuser.User);
            var result = newuser.GetResponseResult(userResource);
            return NotFound(result);
        }

    }
}
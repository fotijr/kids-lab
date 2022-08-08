using System.Security.Claims;
using KidsLab.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KidsLab.Api.Controllers
{
    [Authorize]
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly InMemoryData _db;

        public AccountController(InMemoryData db)
        {
            _db = db;
        }

        private User GetUser()
        {
            // all cookie values are strings. Retreive them, then convert to their proper data types.
            var userId = this.User.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier).Select(n => n.Value).Single();
            var name = this.User.Claims.Where(c => c.Type == ClaimTypes.Name).Select(n => n.Value).Single();

            var id = Guid.Parse(userId);
            var dataStoreUser = _db.GetUser(id);
            if (dataStoreUser != null)
            {
                return dataStoreUser;
            }
            // User not in data store. Must have restarted web api since last log in.
            return new User
            {
                Id = id,
                Name = name
            };
        }

        [HttpGet]
        public User Get()
        {
            var user = GetUser();
            return user;
        }

        [HttpGet("all")]
        public List<User> GetAll()
        {
            return _db.Users;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<User> Login([FromBody] User user)
        {
            var savedUser = _db.AddUser(user);

            // generate cookie
            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
            // using NameIdentifier as User ID
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
            identity.AddClaim(new Claim(ClaimTypes.Name, user.Name));
            // using DateOfBirth as age
            identity.AddClaim(new Claim(ClaimTypes.DateOfBirth, user.Age.ToString()));

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity),
                new AuthenticationProperties
                {
                    IsPersistent = true
                });

            return savedUser;
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task Logout()
        {
            if (HttpContext.User?.Identity?.IsAuthenticated == true)
            {
                await HttpContext.SignOutAsync();
            }
        }

    }
}


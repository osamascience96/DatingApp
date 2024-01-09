using API.Data;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    [AllowAnonymous]
    public class AccountController: BaseAPIController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(Registerdto registerdto)
        {
            var userExists = await UserExists(registerdto.Username);
            if (userExists)
            {
                return BadRequest("Username is Taken");
            }
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = registerdto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerdto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var tokenStr = _tokenService.CreateToken(user);
            return Ok(new UserDto
            {
                Username = user.UserName,
                Token = tokenStr
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(Logindto logindto)
        {
            var user = _context.Users.SingleOrDefault(x => x.UserName == logindto.Username);
            if (user == null)
            {
                return Unauthorized("Invalid Username");
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(logindto.Password));

            var isPasswordEqual = ByteArrayCompare(user.PasswordHash, computedHash);
            if (!isPasswordEqual)
            {
                return Unauthorized("Invalid Password");
            }
            var tokenStr = _tokenService.CreateToken(user);
            return Ok(new UserDto
            {
                Username = user.UserName,
                Token = tokenStr
            });

        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

        private bool ByteArrayCompare(byte[] a1, byte[] a2) 
        {
            // if both arrays are null
            if(ReferenceEquals(a1, a2))
            {
                return true;
            }

            // if either of the arrays are null
            if(a1 == null || a2 == null)
            {
                return false;
            }

            // check if the their lengths are not equal
            if(a1.Length != a2.Length)
            {
                return false;
            }

            return MemoryExtensions.SequenceEqual<byte>(a1, a2);
        }

    }
}

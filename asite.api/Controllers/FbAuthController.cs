using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using jsite.api.Dtos;
using jsite.api.Helpers;
using jsite.api.Models;
using jsite.api.Models.Facebook;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace jsite.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]

    public class FbAuthController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;
        private static readonly HttpClient _httpClient = new HttpClient();


        public FbAuthController(IMapper mapper, UserManager<User> userManager, IConfiguration config)
        {
            _config = config;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpPost("fblogin")]
        public async Task<IActionResult> FbLogin(FbUserAuthCodeDto fbUserAuthCodeDto)
        {
            string fbAuthToken = await ExchangeFbCodeToFbUserToken(fbUserAuthCodeDto.fbAuthCode);
            FbUser fbUser = await GetFbUser(fbAuthToken);
            User user = await _userManager.FindByEmailAsync(fbUser.Email);

            if (user == null)
            {
                user = new User
                {
                    UserName = fbUser.Email,
                    Email = fbUser.Email,
                    PhotoUrl = fbUser.Picture.Data.Url
                };
                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                    return BadRequest("User not created");

                var res = _userManager.AddToRoleAsync(user, "User").Result;
                if (!res.Succeeded)
                    return BadRequest("error on adding role for user");
            }
            else
            {
                user.PhotoUrl = fbUser.Picture.Data.Url;
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                return BadRequest("error on updating user photo");
            }

            // generate the jwt for the local user...
            var userForToken = await _userManager.FindByEmailAsync(user.Email);
            if (userForToken == null)
                return BadRequest("cant create user");

            string token = AppTokens.GenerateJwtToken(userForToken, _config, _userManager).Result;

            var userForReturnDto = _mapper.Map<UserForReturnDto>(userForToken);
            return Ok(new { token = token, user = userForReturnDto });
        }

        private async Task<string> ExchangeFbCodeToFbUserToken(string fbAuthCode)
        {
            string uri = "https://graph.facebook.com/v6.0/oauth/access_token";
            var param = new Dictionary<string, string>() {
                    {"client_id", _config.GetSection("FbSettings:client_id").Value },
                    {"redirect_uri", _config.GetSection("FbSettings:redirect_uri").Value},
                    {"client_secret",_config.GetSection("FbSettings:client_secret").Value},
                    {"code",fbAuthCode}
                 };
            var requestUri = new Uri(QueryHelpers.AddQueryString(uri, param));

            var response = await _httpClient.GetStringAsync(requestUri);
            string fbAccessToken = JsonConvert.DeserializeObject<FbAccessToken>(response).access_token;
            return fbAccessToken;
        }

        private async Task<FbUser> GetFbUser(string fbAccessToken)
        {
            var uri = "https://graph.facebook.com/v6.0/me";
            var param = new Dictionary<string, string>(){
                {"fields","id,email,picture"},
                {"access_token", fbAccessToken}
            };
            var requestUri = new Uri(QueryHelpers.AddQueryString(uri, param));
            string userData = await _httpClient.GetStringAsync(requestUri);

            var fbUser = JsonConvert.DeserializeObject<FbUser>(userData);

            return fbUser;
        }
    }
}
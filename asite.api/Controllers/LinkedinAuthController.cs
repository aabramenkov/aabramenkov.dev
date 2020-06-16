using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using jsite.api.Dtos;
using jsite.api.Helpers;
using jsite.api.Models;
using jsite.api.Models.Linkedin;
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

    public class LinkedinAuthController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;
        private static readonly HttpClient _httpClient = new HttpClient();


        public LinkedinAuthController(IMapper mapper, UserManager<User> userManager, IConfiguration config)
        {
            _config = config;
            _userManager = userManager;
            _mapper = mapper;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LinkedinUserAuthCodeDto linkedinUserAuthCodeDto)
        {
            string linkedinAuthToken = await ExchangeLinkedinCodeToUserToken(linkedinUserAuthCodeDto.LinkedinAuthCode);
            LinkedinUser linkedinUser = await GetLinkedinUser(linkedinAuthToken);
            User user = await _userManager.FindByEmailAsync(linkedinUser.Email);

            if (user == null)
            {
                user = new User
                {
                    UserName = linkedinUser.Email,
                    Email = linkedinUser.Email,
                    PhotoUrl = linkedinUser.PhotoUrl,
                    RegisteredVia = "Linkedin",
                    Created = DateTime.Now,
                    LastActive = DateTime.Now
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
                user.PhotoUrl = linkedinUser.PhotoUrl;
                user.LastActive = DateTime.Now;
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

        private async Task<string> ExchangeLinkedinCodeToUserToken(string linkedinAuthCode)
        {
            string uri = "https://www.linkedin.com/oauth/v2/accessToken";
            var param = new Dictionary<string, string>() {
                {"grant_type", "authorization_code"},
                    {"client_id", _config.GetSection("LinkedinSettings:client_id").Value },
                    {"redirect_uri", _config.GetSection("LinkedinSettings:redirect_uri").Value},
                    {"client_secret",_config.GetSection("LinkedinSettings:client_secret").Value},
                    {"code",linkedinAuthCode}
                 };
            var requestUri = new Uri(QueryHelpers.AddQueryString(uri, param));

            var response = await _httpClient.GetStringAsync(requestUri);
            string linkedinAccessToken = JsonConvert.DeserializeObject<LinkedinAccessToken>(response).access_token;
            return linkedinAccessToken;
        }

        private async Task<LinkedinUser> GetLinkedinUser(string linkedinAccessToken)
        {
            var uri = "https://api.linkedin.com/v2/me";
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + linkedinAccessToken);
            string userData = await _httpClient.GetStringAsync(uri);

            var linkedinUser = JsonConvert.DeserializeObject<LinkedinUser>(userData);
            linkedinUser.Email = await GetEmail();
            linkedinUser.PhotoUrl = await GetPhotoUrl();
            return linkedinUser;
        }

        private async Task<string> GetEmail(){
            var uri = "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))";
            string userData = await _httpClient.GetStringAsync(uri);
            Email email = JsonConvert.DeserializeObject<Email>(userData);
            return email.Elements[0].ElementHandle.EmailAddress;
        }

        private async Task<string> GetPhotoUrl(){
            var uri = "https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~digitalmediaAsset:playableStreams))";
            string userData = await _httpClient.GetStringAsync(uri);
            LinkedinPhoto linkedinPhoto =  JsonConvert.DeserializeObject<LinkedinPhoto>(userData);
            string photoUrl = linkedinPhoto.ProfilePicture.ProfilePictureDisplayImage.Elements[0].Identifiers[0].IdentifierIdentifier.AbsoluteUri.ToString();

            return photoUrl;
        }



}
}
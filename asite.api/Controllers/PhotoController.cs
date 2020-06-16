using System.Net;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using jsite.api.Dtos;
using jsite.api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace jsite.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "AdminOrModerator")]

    public class PhotoController : ControllerBase
    {
        private Cloudinary _cloudinary;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;

        public PhotoController(IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _cloudinaryConfig = cloudinaryConfig;
            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(acc);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadPhoto([FromForm] PhotoForUploadDto photoForUploadDto)
        {
            var uploadResult = new ImageUploadResult();

            var file = photoForUploadDto.File;
            if (file.Length > 0)
            {

                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new CloudinaryDotNet.FileDescription(file.FileName, stream),
                        Transformation = new CloudinaryDotNet.Transformation().Width(500)
                    };
                    uploadResult = await _cloudinary.UploadAsync(uploadParams);
                }
            }
            if (uploadResult.StatusCode == HttpStatusCode.OK){
                string cloudinaryReturnUri = uploadResult.SecureUrl.ToString();
                return Ok(new { Uri = cloudinaryReturnUri});
            }
            return BadRequest (uploadResult.Error);
        }

    }
}
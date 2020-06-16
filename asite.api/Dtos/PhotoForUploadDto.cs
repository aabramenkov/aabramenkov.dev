using Microsoft.AspNetCore.Http;

namespace jsite.api.Dtos
{
    public class PhotoForUploadDto
    {
        public string Name { get; set; }
        public IFormFile File { get; set; }

    }
}
using System.ComponentModel.DataAnnotations;

namespace jsite.api.Dtos
{
    public class UserForRegisterDto
    {
        public string Username {get;set;}
        public string Email { get; set; }
        [Required]
        // [StringLength(8, MinimumLength = 4, ErrorMessage = "You must specify password between 4 and 8 characters")]
        public string Password { get; set; }

    }
}
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class Registerdto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }
    }
}

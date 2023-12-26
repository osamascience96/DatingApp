using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class Registerdto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}

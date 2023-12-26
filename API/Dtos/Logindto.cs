using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class Logindto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}

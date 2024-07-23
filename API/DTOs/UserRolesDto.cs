namespace API.DTOs
{
    public class UserRolesDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }

        public List<string> Roles { get; set; }
    }
}
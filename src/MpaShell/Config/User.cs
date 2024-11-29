namespace MpaShell.Config
{
    // user
    public class User {
        public string Id { get; set; } = "";
        public string Username { get; set; } = "";
        public bool Authenticated { get; set; } = false;
        public Dictionary<string,string> Claims { get; set; } = [];
    }

}
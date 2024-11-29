namespace MpaShell.Config
{
    // menuitem
    public class Menuitem {
        public string Label { get; set; } = "";
        public string? Icon { get; set; }
        public string? Href { get; set; }
        public Menuitem[]? Children { get; set; }
    }

}
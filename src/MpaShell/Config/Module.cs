namespace MpaShell.Config
{
    public class Module {

        //props
        public ModuleInfo Info { get; set; } = new();
        public Loader Loader { get; set; } = new();
        public Dictionary<string, Menuitem[]> Menus { get; set; } = new();
        public Dictionary<string, Dictionary<string, string>> Strings { get; set; } = new();
        public string? Url { get; set; }

    }

}
namespace MpaShell.Config
{
    public class LoaderDefinition {
        public string Resource { get; set; } = "";
        public string Src { get; set; } = "";
        public LoaderDefinitionWith? With { get; set; }
    }

}
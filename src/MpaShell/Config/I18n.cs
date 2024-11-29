namespace MpaShell.Config
{
    public class I18n {
        public string Lang { get; set; } = "";
        public List<I18nLang> Langs { get; set; } = [
            new() { Id = "en", Label = "English", Main = true },
            new() { Id = "es", Label = "Spanish" },
            new() { Id = "fr", Label = "French" },
            new() { Id = "de", Label = "German" }
        ];
    }

}
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.FileProviders;

namespace MpaShell.Config {

    // config
    public class App {

        //props
        public I18n I18n { get; set; } = new();
        public AppInfo Info { get; set; } = new();        
        public Module[] Modules { get; set; } = [];
        public Navigator Navigator { get; set; } = new();
        public Settings Settings { get; set; } = new();
        public User User { get; set; } = new();

        //methods
        public void AddModule(Module module) {
            Modules = Modules.Concat([module]).ToArray();
        }
    }

}
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.DependencyInjection;

using MpaShell.Config;

namespace Sample1.Module1 {

    public static class Module1Extensions {

        public static void AddMpaShellModule1(this IServiceCollection services, App app) {

            // add module
            app.AddModule(new Module() {
                Info = new() {
                    Name = typeof(Module1Extensions).Assembly.GetName().Name ?? "",
                    Label = "",
                    Version = typeof(Module1Extensions).Assembly.GetName().Version?.ToString() ?? ""
                },
                Loader = new() {
                },
                Menus = new Dictionary<string, Menuitem[]>() {
                    { "main", [
                        new () { Label = "aaaaa 1", Icon = "x-icon1", Href = "/a1"},
                        new () { Label = "aaaaa 2", Icon = "x-icon1", Href = "/a2"},
                        new () { Label = "aaaaa 3", Icon = "x-icon1", Href = "/a3"},
                        new () { Label = "aaaaa 4", Icon = "x-icon1", Href = "/a4"}
                    ]}
                }
            });

            //add menu

            //var assembly = typeof(Module1Extensions).Assembly;
            //// This creates an AssemblyPart, but does not create any related parts for items such as views.
            //var part = new AssemblyPart(assembly);
            ////services.AddControllersWithViews().ConfigureApplicationPartManager(apm => apm.ApplicationParts.Add(part));
            //services.AddControllersWithViews().AddApplicationPart(assembly);
        }
    }
}

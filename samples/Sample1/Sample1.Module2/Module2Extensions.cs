using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.DependencyInjection;

using MpaShell.Config;

namespace Sample1.Module2 {
    public static class Module2Extensions {

        public static void AddMpaShellModule2(this IServiceCollection services, App appConfig) {
            //var assembly = typeof(Module2Extensions).Assembly;
            //// This creates an AssemblyPart, but does not create any related parts for items such as views.
            //var part = new AssemblyPart(assembly);
            ////services.AddControllersWithViews().ConfigureApplicationPartManager(apm => apm.ApplicationParts.Add(part));
            //services.AddControllersWithViews().AddApplicationPart(assembly);
        }
    }
}

using Microsoft.Extensions.FileProviders;

using MpaShell;
using MpaShell.Config;

using Sample1.Module1;
using Sample1.Module2;

namespace Sample1 { 

    public class Program {

        // main
        public static async Task Main(string[] args) {

            // Add services to the container.
            var builder = WebApplication.CreateBuilder(args);
            // razor components
            builder.Services.AddRazorComponents();
            // controlles
            builder.Services.AddControllers()
                .AddApplicationPart(typeof(MpaShell.Controllers.Test).Assembly)
                .AddApplicationPart(typeof(Sample1.Module1.Module1Extensions).Assembly)
                .AddApplicationPart(typeof(Sample1.Module2.Module2Extensions).Assembly);
            // MpaShell
            builder.Services.AddMpaShell( app => { 
                //app
                app.Info.Name = "Sample1";
                app.Info.Title = "Sample1 title";
                app.Info.Version = "0.1.0";
                app.Info.Copyright = "";
                app.Info.Logo = "/logo.png";
                //i18n
                // ...
                //modules
                builder.Services.AddMpaShellModule1(app);
                builder.Services.AddMpaShellModule2(app);
                //navigator
                app.Navigator.Base = "/";
                app.Navigator.Start = "";
                //settings
                //...
                //user
                //...
            });

            // Build app
            var app = builder.Build();
            if (!app.Environment.IsDevelopment()) {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseAntiforgery();
            app.MapControllers();
            app.MapRazorComponents<MpaShell.App>().AddAdditionalAssemblies(
                typeof(Sample1.Module1.Module1Extensions).Assembly,
                typeof(Sample1.Module2.Module2Extensions).Assembly
            );
            app.UseStatusCodePages();
            app.UseMpaShell();

            // Run
            await app.RunAsync();
        }

    }
}


/*

TODO:
x - server MpaShell wwwroot resources: https://localhost:7041/_content/MpaShell/...
x - move App.razor and routes.razaor to MpaShell project
x - move pages to MpaShell project
x - 404 error ---> NO!!!
x - move /api/config to MpaShell project
x - config blazor SSR only render mode


- cada module es carrega les seves coses
- investigate if its possible to use different middleware "branches" for each module, or at least, investigate if exists something similar to that concept
- autogenerate api documentation (OpenAPI)


*/
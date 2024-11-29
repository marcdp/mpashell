using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

using MpaShell.Config;

namespace MpaShell { 

    public static class MpaShellExtensions {

        public static IServiceCollection AddMpaShell(this IServiceCollection services, Action<Config.App> handler) {
            // config
            var appConfig = new Config.App();

            //invoke
            handler(appConfig);
            services.AddSingleton(appConfig);

            //return
            return services;
        }
        public static IApplicationBuilder UseMpaShell(this IApplicationBuilder app) {

            //// add middleware to acces src folder
            //var assembly = typeof(XShellExtensions).Assembly;
            //var resourceNamespace = typeof(XShellExtensions).Assembly.GetName().Name + ".Resources";
            //var embeddedProvider = new EmbeddedFileProvider(assembly, resourceNamespace);
            //app.UseStaticFiles(new StaticFileOptions() {
            //    FileProvider = embeddedProvider,
            //    RequestPath = "/src"
            //});

            // return
            return app;
        }

    }
}
using Microsoft.Extensions.FileProviders;

namespace Sample2 {
    public class Program {
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();
            // Serve static files from wwwroot
            app.UseStaticFiles();

            // Serve default files (e.g., index.html)
            app.UseDefaultFiles();

            // Add fallback middleware for index.html
            app.UseStaticFiles();

            // Add libs mpa-shell
            app.UseStaticFiles(new StaticFileOptions() {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "src", "MpaShell", "wwwroot")),
                RequestPath = "/libs/mpa-shell"
            });

            //run
            app.Run();
        }
    }
}


/*



- rename x- to mpa-

*/
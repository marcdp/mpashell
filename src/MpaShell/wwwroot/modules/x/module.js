
export default {
    //config
    config: {

        // app
        "app.layout.default": "x-app-layout-default",

        //module
        "modules.x.name": "x",
        "modules.x.label": "X module",
        "modules.x.version": "1.0.0.0",
        "modules.x.depends": [],
        "modules.x.styles": ["./css/styles.css"],

        //loader
        "loader.page-handler.x-{name}": "./ui/page-handlers/x-{name}.js",
        "loader.type-converter.x-element": "./ui/type-converters/from-html.js",
        "loader.component.x-{name}": "./components/x-{name}.js",
        "loader.layout.x-{name}": "./layouts/x-{name}.js",
        "loader.page.x-{name}": "./pages/x-{name}.html",
        "loader.icon.x-{name}": "./icons/{name}.svg",
        "loader.icon.x-{name}.with": "svg",
        "loader.component.ace-editor": "https://unpkg.com/ace-custom-element@latest/dist/index.min.js",

        // page
        "page.error": "x-page-error",
        "page.meta.x-page-handler": "x-page-handler-html",
        "page.layout.default": "x-page-layout-default",
        "page.layout.dialog": "x-page-layout-dialog",
        "page.layout.main": "x-page-layout-main",
        "page.layout.stack": "x-page-layout-stack",
        "page.loading": "x-page-loading",


    },
    // methods
    async mount() {
    }
}

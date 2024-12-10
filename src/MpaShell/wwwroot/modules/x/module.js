
export default {
    //config
    config: {

        //module
        "modules.x.name": "x",
        "modules.x.label": "X module",
        "modules.x.version": "1.0.0.0",

        //loader
        "loader.page-handler.x-{name}": "./ui/page-handlers/x-{name}.js",
        "loader.type-converter.x-element": "./ui/type-converters/from-html.js",
        "loader.component.x-{name}": "./components/x-{name}.js",
        "loader.layout.x-{name}": "./layouts/x-{name}.js",
        "loader.page.x-{name}": "./pages/x-{name}.html",
        "loader.icon.x-{name}": "./icons/{name}.svg",
        "loader.icon.x-{name}.with": "svg",
        "loader.component.ace-editor": "https://unpkg.com/ace-custom-element@latest/dist/index.min.js",

        //ui
        "ui.components.page-error": "x-page-error",
        "ui.components.page-loading": "x-page-loading",

        "ui.layouts.app.main": "x-layout-app-main",
        "ui.layouts.page.main": "x-layout-page-main",
        "ui.layouts.page.stack": "x-layout-page-stack",
        "ui.layouts.page.dialog": "x-layout-page-dialog",
        "ui.layouts.page.default": "x-layout-page-default",

        "ui.meta.x-page-handler": "x-page-handler-sfc",

        "ui.stylesheets.default": "./css/index.css"
    },
    // methods
    async mount() {
    }
}

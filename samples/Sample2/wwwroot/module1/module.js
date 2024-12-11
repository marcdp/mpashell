export default {
    //config
    config: {

        //module
        "modules.module1.name": "module1",
        "modules.module1.label": "Module 1 title",
        "modules.module1.version": "0.1",
        "modules.module1.depends": [],
        "modules.module1.styles": ["./css/styles.css"],
        
        //loader
        "loader.icon.module1-{name}": "./icons/{name}.svg",
        "loader.icon.module1-{name}.with": "svg",
        "loader.page.module1-{name}": "./pages/{name}.html",
        "loader.component.module1-{name}": "./components/{name}.js",
        "loader.layout.module1-{name}": "./layouts/module1-{name}.js",

    },
    //methods
    mount() {
    }
}
import loader from "./loader.js";
import config from "./config.js";
import utils from "./utils.js";
import XApp from "./x-app.js";
import XPage from "./x-page.js";


// class
class App {


    //fields
    _modules = {};
    _xApp = null;


    //ctor
    constructor() {
        console.log(`app.constructor()`);
    }

    //methods
    async init(value) {
        //init
        let url = "";
        //load
        if (typeof (value) == "string") {
            console.log(`app.init('${value}') ...`);
            url = value;
            let response = await fetch(url);
            if (!response.ok) {
                console.error(`app.init(): ${response.status} ${response.statusText}`);
                return;
            }
            value = JSON.parse(utils.stripJsonComments(await response.text()));
        } else {
            console.log(`app.init({...}) ...`);
            url = document.location.href.split("#")[0];
        }
        config.set(value, url);
        //load modules
        let modules = config.getAsObjects("modules");
        let tasks = [];
        for (let module of modules) {
            if (module.url && !module.path) {
                tasks.push(this.loadModule(module))
            }
        }
        await Promise.all(tasks);
        let aux = this._modules;
    }
    async loadModule(module) {
        //load module
        console.log(`app.loadModule('${module.url}') ...`);
        let aModule = await import(module.url)
        //get default exports
        let instance = aModule.default
        //add config
        let instanceConfig = instance.config;
        let name = "";
        for (let key in instance.config) {
            if (key.startsWith("modules.")) {
                name = key.split(".")[1];
            }
        }
        config.set(instance.config, module.url)
        delete instance.config;
        //set
        instance.args = module.args || {};
        this._modules[name] = instance;
        //mount
        await instance.mount();
    }
    async start() {
        //log
        console.log(`app.start()`, config.config);
        //start date
        config.set({ "app.started-at": new Date() });
        //create container
        this._xApp = new XApp({
            start: config.get("app.start")
        });
        document.body.insertBefore(this._xApp, document.body.firstChild);
    }


    //public
    async showPage({ url, type, sender, target }) {
        await this._xApp.showPage({url, type, sender, target});
    }
    async showDialog({url, sender}) {
        return await this._xApp.showPage({url, target: "#dialog", sender});
    } 

}

//export default instance
export default new App();


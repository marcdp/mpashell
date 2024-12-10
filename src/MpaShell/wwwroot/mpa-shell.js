import i18n         from "./i18n.js";
import loader       from "./loader.js";
import ui           from "./ui.js";
import utils        from "./utils.js";

import MpaPage from "./mpa-page.js";
import MpaNavigator from "./mpa-navigator.js";

asd

// class
class MpaShell extends HTMLElement {
    
    //fields
    _config = {
        // info
        app: {
            name: "",
            label: "",
            version: "",
            copyright: "",
            logo: ""
        },
        // loader
        //loader: loader.config,
        //other
        /*
        i18n: i18n.config,
        modules: [],
        navigator: {
            base:  document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/")),
            start: "",
        },
        ui: ui.config,
        */
    };
    //_startedAt = new Date();
    _modules = [];

    //ctor
    constructor() {
        super();
        console.log(`mpa-shell.constructor()`);
    }

    //props
    //get config() { return this._config; }
    get navigator() { return this.firstChild; }
    get loader() { return loader; }
    //get startedAt() { return this._startedAt; }


    //events
    async connectedCallback() {
        let src = this.getAttribute("src");
        if (src) await this.init(src);
    }

    //methods
    async init(src) {
        //init
        let url = src;
        console.log(`mpa-shell.init('${url}') ...`);
        let response = await fetch(url);
        if (!response.ok) {
            console.error(`mpa-shell.addConfig(): ${response.status} ${response.statusText}`);
            return;
        }
        //load config
        let json = utils.stripJsonComments(await response.text());
        let config = JSON.parse(json);
        utils.traverse(config, (obj, key) => {
            let value = obj[key];
            if (typeof value === "string" && (key == "src" || key == "script")) {
                if (value.startsWith("./") || value.startsWith("../")) {
                    obj[key] = utils.combineUrls(url, value);
                }
            }
        });
        this._config = utils.deepAssign(this._config, config);
        //load modules
        let tasks = [];
        for (let i = 0; i < this._config.modules.length; i++) {
            let module = this._config.modules[i];
            if (module.url && !module.path) {
                tasks.push(this.loadModule(module))
            }
        }
        await Promise.all(tasks);
        //mount modules sequentially
        for (let module of this._modules) {
            await this.mountModule(module);
        }
    }
    async loadModule(module) {
        //load module
        console.log(`  loading module '${module.url}' ...`);
        let aModule = await import(module.url)
        let instance = aModule.default
        instance.src = module.url;
        this._modules.push(instance);
    }
    async mountModule(module) {
        console.log(`  mounting module '${module.url}' ...`);
        if (module.loader && module.loader.map) {
            loader.addLoadMap(module.loader.map, module.src)
        }
        await module.mount(this);
    }
    //this._config = utils.deepAssign(this._config, module.override);
    //delete module.override;
    /*
    async start() {
        debugger;
        //start
        console.log(`mpa-shell.start()`);
        //init i18n
        //await i18n.init(this._config.i18n);
        //init loader
        await loader.init(this._config.loader);
        //init uri
        await ui.init(this._config.ui);
        //init navigator
        this.appendChild(new MpaNavigator());
        await this.navigator.init(this._config.navigator);
        //start ui
        await ui.start();
        //start navigator
        await this.navigator.start();
        //ready
        await this.ready();
    }
    async ready() {
        //ready
        console.log(`mpa-shell.ready(): `, this._config);
    }*/
    

    //public
    async showPage({url, type, sender, target}) {
        await this.navigator.showPage({url, type, sender, target});
    }
    async showDialog({url, sender}) {
        return await this.navigator.showPage({url, target: "#dialog", sender});
    }
    getRealUrl(url, page, settings){
        return this.navigator.getRealUrl(url, page, settings);
    }
    getPage(target) {
        while (target) {
            if (!target.parentNode) {
                target = target.host;
            }
            if (!target) {
                //debugger;
                return null;
            }
            if (target.localName == "mpa-page") return target;
            target = target.parentNode;
        }
        return null;
    }

}


//define web component
customElements.define('mpa-shell', MpaShell);


//get or create instance
let mpaShell = document.querySelector("mpa-shell");
if (!mpaShell) {
    mpaShell = document.createElement("mpa-shell");
    document.body.appendChild(mpaShell);
}


//export default instance
export default mpaShell;


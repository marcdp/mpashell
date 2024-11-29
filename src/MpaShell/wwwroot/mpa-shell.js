import bus          from "./bus.js";
import i18n         from "./i18n.js";
import loader       from "./loader.js";
import settings     from "./settings.js";
import ui           from "./ui.js";
import utils        from "./utils.js";

import MpaPage from "./mpa-page.js";
import MpaNavigator from "./mpa-navigator.js";

// class
class MpaShell extends HTMLElement {
    
    //fields
    _config = {
        bus: bus.config,
        i18n: i18n.config,
        info: {
            name: "",
            label: "",
            version: "",
            copyright: "",
            logo: ""
        },
        loader: loader.config,
        modules: [],
        navigator: {
            base:  document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/")),
            start: "",
        },
        settings: settings.config,
        ui: ui.config,
        user: {
            id: "",
            username: "anonymous",
            authenticated: false,
            claims: {}
        }
    };
    _startedAt = new Date();

    //ctor
    constructor() {
        super();
        console.log(`mpa-shell.constructor()`);
    }

    //props
    get config() { return this._config; }
    get navigator() { return this.firstChild; }
    get startedAt() { return this._startedAt; }


    //events
    async connectedCallback() {
        let src = this.getAttribute("src");
        await this.addConfig(src);
        await this.start();
    }

    //methods    
    async addConfig(config, src = null) {
        if (typeof(config) == "string" && config.startsWith("#")) {
            //add config from element in the current page #id
            console.log(`mpa-shell.addConfig('${src || config}')`);
            let json = document.querySelector(config).textContent;
            config = JSON.parse(utils.stripJsonComments(json));
            this._config = utils.deepAssign(this._config, config);        
        } else if (typeof(config) == "string") {
            //add config from remote json file
            let url = utils.combineUrls(this.config.navigator.base, config); 
            console.log(`mpa-shell.addConfig('${url}')`);
            let response = await fetch(url);
            if (response.ok) {
                let json = utils.stripJsonComments(await response.text());
                config = JSON.parse(json);
                utils.traverse(config, (obj, key) => {
                    let value = obj[key];
                    if (key == "src" && typeof value === "string") {
                        if (value.startsWith("./") || value.startsWith("../")){
                            obj[key] = utils.combineUrls(url, value);
                        }
                    }
                });
                this._config = utils.deepAssign(this._config, config);
            } else {
                console.error(`mpa-shell.addConfig(): ${response.status} ${response.statusText}`);
            }
        } else if (typeof(config) == "object") {
            //add config from object
            console.log(`mpa-shell.addConfig('${src || config}')`);
            this._config = utils.deepAssign(this._config, config);
        } else {
            //error
            console.error(`mpa-shell.addConfig(): unable to add config, invalid type: ${typeof(config)}`);
        }
    }
    async start() {
        //start
        console.log(`mpa-shell.start()`);
        //load modules that has remote urls
        let tasks = [];
        for(let i = 0; i < this.config.modules.length; i++) {
            let module = this.config.modules[i];
            if (module.url) {
                console.log(`  fetching module '${module.url}' ...`);
                tasks.push((async() => {
                    let response = await fetch(module.url);
                    if (!response.ok) {
                        module.error = `HTTP error! status: ${response.status}`;
                    }  else {
                        let json = JSON.parse(utils.stripJsonComments(await response.text()));
                        module = Object.assign(module, json);
                        utils.traverse(module, (obj, key) => {
                            let value = obj[key];
                            if (key == "src" && typeof value === "string") {
                                if (value.startsWith("./") || value.startsWith("../")) {
                                    let newValue = utils.combineUrls(module.url, value);
                                    obj[key] = newValue;
                                }
                            }
                        });
                        delete module.url;
                        this.config.modules[i] = module;
                    }
                })());
            }
        }
        //override modules
        await Promise.all(tasks);
        for (let module of this.config.modules) {
            if (module.override) {
                this._config = utils.deepAssign(this._config, module.override);
                delete module.override;
            }
        }
        //init i18n
        await i18n.init(this.config.i18n);
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
    }
    

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


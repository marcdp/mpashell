import loader from "./loader.js";
import config from "./config.js";
import utils from "./utils.js";
import bus from "./bus.js";
import XPage from "./x-page.js";

// constants
const HASH_PREFIX = "#!";

// class
class App {


    //fields
    _container = null;
    _modules = {};


    //ctor
    constructor() {
        console.log(`app.constructor()`);
    }


    //props
    get modules() { return this._modules; }


    //methods
    async init(value) {
        //init
        let url = "";
        //defaults
        config.set({
            // app
            "app.name": "",
            "app.label": "",
            "app.version": "",
            "app.copyright": "",
            "app.logo": "",
            "app.base": "",
            "app.start": "",
            "app.container": "body",
            "app.layout.default": "",
            // page
            "page.error": "",
            "page.meta.x-page-handler": "",
            "page.layout.default": "",
            "page.layout.dialog": "",
            "page.layout.main": "",
            "page.layout.stack": "",
            "page.loading": "",
        }, import.meta.url);
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
            if (module.load != "lazy") {
                tasks.push(this.loadModule(module))
            }
        }
        await Promise.all(tasks);
    }

    // modules
    async loadModuleByPath(path) {
        //load module by path
        let modules = config.getAsObjects("modules");
        for (let module of modules) {
            if (path.startsWith(module.path)) {
                if (module.state != "loaded") {
                    await this.loadModule(module);
                    break;
                }
            }
        }
    }
    async loadModuleByName(name) {
        //load module by name
        let module = config.getAsObject("modules." + name);
        if (module.state != "loaded") {
            await this.loadModule(module);
        }
    }
    async loadModule(module) {
        //load module
        console.log(`app.loadModule('${module.url}') ...`);
        let aModule = await import(module.url)
        //get instance
        let instance = aModule.default
        //get name
        let name = "";
        for (let key in instance.config) {
            if (key.startsWith("modules.")) {
                name = key.split(".")[1];
            }
        }
        //add config
        instance.config["modules." + name + ".state"] = "loaded";
        config.set(instance.config, module.url)
        delete instance.config;
        //get depends
        let depends = config.get("modules." + name + ".depends",[]);
        for (let depend of depends) {
            await this.loadModuleByName(depend);
        }
        //get styles
        let tasks = [];
        let styles = config.get("modules." + name + ".styles", []);
        for (let style of styles) {
            tasks.push(this.loadStyleSheet(style));
        }
        await Promise.all(tasks);
        //set
        instance.args = module.args || {};
        this._modules[name] = instance;
        //mount
        await instance.mount();
    }
    async loadStyleSheet(src) {
        let resolve = null;
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", src);
        link.addEventListener("load", () => {
            resolve();
        });
        document.head.appendChild(link);
        return new Promise((resolv) => {
            resolve = resolv;
        });
    }
    async start() {
        //log
        console.log(`app.start()`, config.config);
        //start date
        config.set({ "app.started-at": new Date() });
        //add event listener
        window.addEventListener("hashchange", () => {
            this._navigate(document.location.hash);
        });
        //navigate 
        this._container = document.querySelector(config.get("app.container", "body"));
        if (document.location.hash) {
            await this._navigate(document.location.hash);
        } else {
            document.location.hash = HASH_PREFIX + config.get("app.start");
        }
    }


    //public
    get pages() {
        let result = [];
        for (let child of this._container.children) {
            if (child.localName == "x-page") {
                if (child.getAttribute("type") != "dialog") result.push(child);
            } else {
                result.push(child.firstChild);
            }
        }
        return result;
    }
    async showPage({ url, type, sender, target }) {
        debugger;
        //await this._xApp.showPage({url, type, sender, target});
    }
    async showDialog({ url, sender }) {
        debugger;
        //return await this._xApp.showPage({url, target: "#dialog", sender});
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
            if (target.localName == "x-page") return target;
            target = target.parentNode;
        }
        return null;
    }


    //private
    async _navigate(hash) {
        let hashBeforeParts = (this._hash ? this._hash.split(HASH_PREFIX) : []);
        let hashAfterParts = (hash ? hash.substring(HASH_PREFIX.length).split(HASH_PREFIX) : []);
        let inc = 0;
        //close the last dialog
        while (this._container.querySelector(":scope > x-page.dialog:last-child")) {
            this._container.removeChild(this.lastElementChild);
        }
        //process hash parts
        for (let i = 0; i < Math.max(hashBeforeParts.length, hashAfterParts.length); i++) {
            let hashBeforePart = hashBeforeParts[i];
            let hashAfterPart = hashAfterParts[i];
            if (!hashBeforePart && hashAfterPart) {
                //add page
                let page = document.createElement("x-page");
                page.setAttribute("src", hashAfterPart);
                if (i > 0) {
                    page.setAttribute("type", "stack");
                    page.addEventListener("page:close", (event) => {
                        let hashParts = document.location.hash.substring(HASH_PREFIX.length).split(HASH_PREFIX);
                        let index = this.pages.indexOf(event.target);
                        hashParts = hashParts.filter((_, idx) => idx !== index);
                        document.location.hash = HASH_PREFIX + hashParts.join(HASH_PREFIX);
                    });
                } else {
                    page.setAttribute("type", "main");
                    //emit event navigation:start
                    bus.emit("navigation:start", { page });
                }
                page.addEventListener("page:change", (event) => {
                    if (this.pages.indexOf(event.target) == 0) {
                        //main page change
                        var label = event.target.label;
                        if (label) document.title = label + " / " + config.get("app.label");
                    }
                });
                page.addEventListener("page:load", (event) => {
                    if (this.pages.indexOf(event.target) == 0) {
                        //main page loaded
                        var label = event.target.label;
                        if (label) document.title = label + " / " + config.get("app.label");
                        //emit event navigation:end
                        bus.emit("navigation:end", { page: event.target });
                    }
                });
                let container = this._container;
                //init app layout
                /*
                if (i == 0) {
                    //container = this.firstChild;
                    if (!this.firstChild) {
                        let appLayout = config.get("app.layout.default");
                        if (appLayout) {
                            await loader.load("layout:" + appLayout);
                            container = document.createElement(appLayout);
                            this._container.appendChild(container);
                        }
                    }
                }*/
                //add page to container
                container.appendChild(page);
            } else if (hashBeforePart && !hashAfterPart) {
                //remove page
                let page = this.pages[i + inc];
                if (page.getAttribute("class") == "popup") {
                    page.parentNode.removeChild(page);
                } else {
                    page.hideAndRemove();
                }
                inc -= 1;
            } else if (hashBeforePart != hashAfterPart) {
                //change page
                let page = this.pages[i];
                page.src = hashAfterPart;
                //emit event navigation:start
                if (i == 0) {
                    bus.emit("navigation:start", { page });
                }
            }
        }
        this._hash = hashAfterParts.join(HASH_PREFIX);
    }
}

//export default instance
export default new App();


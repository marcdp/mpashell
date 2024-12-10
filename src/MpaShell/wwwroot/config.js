import utils from "./utils.js"

// class
class Config {

    //vars
    _config = {};
    _listeners = [];
    
    //ctor
    constructor() {
    }

    //props
    get config() { return this._config; }

    //methods   
    subscribe(prefix, callback) {
        this._listeners.push({ prefix, callback });
    }
    unsubscribe(prefix, callback) {
    }
    set(config, from) {
        var keys = []
        for (let key in config) {
            let value = config[key];
            if (typeof (value) == "string") {
                if (value.startsWith("./") || value.startsWith("../")) {
                    if (from) value = utils.combineUrls(from, value);
                }
            }
            this._config[key] = value;
            keys.push(key);
        }
        for (let listener of this._listeners) {
            let found = false;
            for (let key of keys) {
                if (key.startsWith(listener.prefix + ".")) {
                    found = true;
                    break;
                }
            }
            if (found) {
                listener.callback();
            }
        }
    }
    get(key, defaultValue) {
        let result = this._config[key];
        if (typeof (result) != "undefined") return result;
        if (typeof (defaultValue) == "undefined") {
            console.error(`props.get('${key}') is undefined`);
        }
        return defaultValue;
    }
    /*getKeys(prefix) {
        let result = [];
        debugger;
        for (let key in this._config) {
            if (key.startsWith(prefix)) {
                result.push(key)
            };
        }
        return result;
    }*/
    getSubKeys(prefix) {
        let result = [];
        for (let key in this._config) {
            if (key.startsWith(prefix + ".")) {
                let subKey = key.substring(prefix.length + 1).split(".")[0];
                if (result.indexOf(subKey)==-1) {
                    result.push(subKey)
                }
            };
        }
        return result;
    }
    getAsObjects(prefix) {
        let result = [];
        let subKeys = this.getSubKeys(prefix);
        for (let subKey of subKeys) {
            let value = {};
            for (let key in this._config) {
                let aux = prefix + "." + subKey;
                if (key == aux) {
                    value.name = this._config[key];
                } else if (key.startsWith(aux + ".")) {
                    value[key.substring(aux.length+1)] = this._config[key];
                }
            }
            result.push(value);
        }
        return result;
    }
    
};


//export
export default new Config();
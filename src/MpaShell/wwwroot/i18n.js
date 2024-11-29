class I18n {

    //var
    _config = {
        lang: "en",
        langs: [
            { id: 'en', label: 'English', main:true },
            { id: 'fr', label: 'French' },
            { id: 'de', label: 'German' },
            { id: 'es', label: 'Spanish', main:true },
        ],
        strings: {
        }
    };
    _cache = {};
    
    //ctor
    constructor(){
    }

    //props
    get config() { return this._config; }

    //methods
    async init(config) { 
        this._config = config;
        Object.freeze(this._config);
    }
    getMainLangs() {
        let result = this._cache.mainLangs;
        if (!result) {
            result = this.config.langs.filter( (lang) => lang.main).map( (lang) => lang.id);
            this._cache.mainLangs = result;
        }
        return [...result];
        
    }
    getLang(id) {
        let result = this._cache[id];
        if (!result) {
            result = this.config.langs.filter( (lang) => lang.id == id)[0] || null;
            this._cache[id] = result;
        }
        return result;
    }
    translate(label) {
        var translations = this._strings[this.config.lang];
        if (!translations) return label;
        var result = translations[label];
        if (!result) return label;
        return result;    
    }
}

// export
export default new I18n();

/*

// instance
let instance = new I18n();


// function
function i18n (label) {
    return instance.translate(label);
};
i18n.init = async function (config) {
    await instance.init(config);
};
i18n.getMainLangs = function() {
    return instance.getMainLangs();
};
i18n.getLang = function(id) {
    return instance.getLang(id);
};
Object.defineProperty(i18n, 'config', {
    get() {
        return instance.config;
    },
});
Object.defineProperty(i18n, 'strings', {
    get() {
        return instance.strings;
    },
});


//export
export default i18n;
export { I18n };

*/
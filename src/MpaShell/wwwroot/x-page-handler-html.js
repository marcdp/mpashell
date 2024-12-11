import app from "./app.js";

// class
class XPageHandlerHtml extends HTMLElement  {

    //ctor
    constructor() {
        super();   
    }

    //properties
    get page() {
        return app.getPage(this);
    }

    //methods
    init(doc, src) {
        //init page
        let scripts = []
        doc.body.childNodes.forEach((node) => {
            if (node.tagName == "SCRIPT") {
                scripts.push(node);
            } else {
                node.cloneNode(true)
                this.appendChild(node.cloneNode(true));
            }
        });
        //activate scripts
        scripts.forEach((script) => {
            let newScript = document.createElement("script");
            for (var i = 0; i < script.attributes.length; i++) {
                newScript.setAttribute(script.attributes[i].name, script.attributes[i].value);
            }
            newScript.textContent = script.textContent;
            this.appendChild(newScript);
        })
    }
    connectedCallback() {
    }
}

//define web component
customElements.define('x-page-handler-html', XPageHandlerHtml);

//export 
export default XPageHandlerHtml;


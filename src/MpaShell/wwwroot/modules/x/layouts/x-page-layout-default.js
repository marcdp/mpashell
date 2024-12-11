import XElement from "../ui/x-element.js";

// class
export default XElement.define("x-page-layout-default", {
    style: `
        :host {display:block;}
    `,
    template: `<slot></slot>`
});

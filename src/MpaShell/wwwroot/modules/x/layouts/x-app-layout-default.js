import XElement from "../ui/x-element.js";

// class
export default XElement.define("x-app-layout-default", {
    style: `
        :host {display:block;}
    `,
    template: `
        this is the default layout
        <slot></slot>
        
    `
});

import XElement from "../ui/x-element.js";
import config from "./../../../config.js";

// class
export default XElement.define("x-app-drawer", {
    style: `
        :host {
            display:block;
            position:fixed;
            z-index:20;
            width:var(--x-app-drawer-width);
            left:0;
            top:0;
            bottom:0;
            background:var(--x-background-gray);
            padding:1em;
            box-sizing:border-box;
        }
        a.logo {display:flex; align-items:center; text-decoration:none; color:var(--x-text-color); padding-left:.65em; padding-right:.5em; margin-bottom:1em;}
        a.logo {height:2em; object-fit:contain;}
        a.logo .label {font-weight:600; padding-left:.5em;; }

        :host > div {
            display:none;
        }

    `,
    template: `
        <a class="logo" x-attr:href="state.url">
            <img x-attr:src="state.logo"></img>
            <span class="label" x-text="state.label"></span>
        </a>
        <x-app-menu menu="primary"></x-app-menu>
        <!--
        <div x-attr:class="state.expanded ? 'expanded' + (state.animate ? ' animate' : '') : ''">
            <div class="backdrop" x-on:click="toggle"></div>
            <div class="container">
                <x-button class="plain close" x-on:click="toggle" icon="x-close"></x-button>
                <slot></slot>
            </div>
        </div>-->
    `,    
    state: {
        label: "",
        logo: null,
        url: "#",
        expanded: false,
        animate: false,
    },
    settings: {
        observedAttributes: [],
    },
    methods:{
        toggle() {
            this.onCommand("toggle");
        },
        onStateChanged2(name, oldValue, newValue) {
            if (name == "expanded") {
                if (newValue) {
                    this.render();
                    this.state.animate = true;
                } else {
                    this.state.animate = false;
                }
            }
        },
        onCommand(command) {
            if (command == "load") {
                // load
                this.state.label = config.get("app.label");
                this.state.logo = config.get("app.logo");
                this.state.url = config.get("app.base");

            } else if (command == "toggle") {
                //toggle
                if (!this.state.expanded) {
                    this.state.expanded = true;
                    this.render();
                    setTimeout(() => {
                        this.state.animate = true;
                    }, 100);                    
                } else {
                    this.state.animate = false;                    
                    this.render();
                    setTimeout(() => {
                        this.state.expanded = false;                    
                    }, 250);
                }
                
            }
        }
    }
});


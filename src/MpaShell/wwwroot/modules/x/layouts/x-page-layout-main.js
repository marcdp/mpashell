import XElement from "../ui/x-element.js";

// class
export default XElement.define("x-page-layout-main", {
    style: `
        :host {display:block; margin-left:var(--x-app-drawer-width);}
        :host x-page-body {}

        @media only screen and (max-width: 768px) {
            :host x-page-header {background:white; position:sticky; top:0; z-index:10 }
        }
    `,
    template: `
        <x-page-header class="hide-close">
            <x-breadcrumb slot="breadcrumb"></x-breadcrumb>
            <slot name="header"></slot>
        </x-page-header>
        <x-page-body class="">
            <slot></slot>
        </x-page-body>
    `
});

import XElement from "../ui/x-element.js";

// class
export default XElement.define("x-layout-page-main", {
    style: `
        :host {display:inline; _height:100vh;}
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

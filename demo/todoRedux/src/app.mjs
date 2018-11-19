import './dom/add.mjs';
import './dom/list.mjs';
import './dom/filter.mjs';

import {AddConnector}    from './logic/connectors/add.mjs';
import {ListConnector}   from './logic/connectors/list.mjs';
import {FilterConnector} from './logic/connectors/filter.mjs';

import $ from '../node_modules/shadow-query/shadowQuery.mjs';

const template = `
	<style>
		:host, :host > style ~ * {display: block;}
		sq-todo-list {
			height: 10rem;
			width: 15rem;
			overflow: auto;
		}
	</style>
	<sq-todo-add></sq-todo-add>
	<sq-todo-list></sq-todo-list>
	<sq-todo-filter></sq-todo-filter>
`;
window.customElements.define('sq-todo-app', class extends HTMLElement {
	constructor() {super();}
	connectedCallback() {
		$(this).shadow(template);
		new AddConnector(   $(this, 'sq-todo-add'   ));
		new ListConnector(  $(this, 'sq-todo-list'  ));
		new FilterConnector($(this, 'sq-todo-filter'));
	}
});

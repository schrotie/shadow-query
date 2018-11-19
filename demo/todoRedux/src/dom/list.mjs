import './item.mjs';
import $ from '../../node_modules/shadow-query/shadowQuery.mjs';

window.customElements.define('sq-todo-list', class extends HTMLElement {
	constructor() {
		super();
		$(this).on('prop:list', this.update.bind(this));
	}
	connectedCallback() {$(this).shadow(`<ul></ul>`);}
	update() {$(this, 'ul').append({
		array: this.list,
		template: `<li><sq-todo-item></sq-todo-item></li>`,
		update: this._updateItem.bind(this),
	});}
	_updateItem(node, todo) {
		node.query('sq-todo-item').prop('sqTodo', todo);
	}
});

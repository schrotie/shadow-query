import $ from '../../node_modules/shadow-query/shadowQuery.mjs';

const template = `
	<style>
		label {cursor: pointer;}
		label.completed {text-decoration: line-through;}
	</style>
	<label> </label>
`;
window.customElements.define('sq-todo-item', class extends HTMLElement {
	constructor() {
		super();
		$(this).on('prop:sqTodo', this._update.bind(this));
		$(this).on('click', this._click.bind(this));
	}
	connectedCallback() {
		$(this).shadow(template);
		this._update();
	}
	_update() {
		$(this, 'label').text(this.sqTodo && this.sqTodo.text)
		.toggleClass('completed', this.sqTodo && this.sqTodo.completed);
	}
	_click() {
		this.dispatchEvent(new CustomEvent('toggle', {
			bubbles : true,
			composed: true,
			detail  : this.sqTodo.id,
		}));
	}
});

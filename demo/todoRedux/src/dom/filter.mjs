import $ from '../../node_modules/shadow-query/shadowQuery.mjs';

const template = `
	<label>Show:</label>
	<button disabled id="SHOW_ALL">All</button>
	<button id="SHOW_ACTIVE">Active</button>
	<button id="SHOW_COMPLETED">Completed</button>
`;
window.customElements.define('sq-todo-filter', class extends HTMLElement {
	constructor() {
		super();
		$(this).on('prop:filter', this.update.bind(this));
	}
	connectedCallback() {
		$(this).shadow(template);
		$(this, 'button').on('click', this._click.bind(this));
	}
	update() {
		$(this, 'button').attr('disabled', false);
		$(this, `#${this.filter}`).attr('disabled', true);
	}
	_click(evt) {
		this.dispatchEvent(new CustomEvent(
			'filter', {detail:evt.composedPath()[0].id})
		);
	}
});

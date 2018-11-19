import $ from '../../node_modules/shadow-query/shadowQuery.mjs';

const template = `
	<input></input>
	<button>Add</button>
`;
window.customElements.define('sq-todo-add', class extends HTMLElement {
	constructor() {super();}
	connectedCallback() {
		$(this).shadow(template);
		$(this, 'input')
		.on('keyup', evt => (evt.keyCode === 13) && this._add());
		$(this, 'button').on('click', this._add.bind(this));
	}
	_add() {
		this.dispatchEvent(
			new CustomEvent('add', {detail:$(this, 'input').prop('value')})
		);
		$(this, 'input').prop('value', '');
	}
});

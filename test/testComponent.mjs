const template = document.createElement('template');
template.innerHTML = `
	<span id="span"/>
	<button id="button"/>
	<div id="div">
		<label id="label"/>
	</div>
	<h1 id="h1-1"/>
	<h1 id="h1-2"/>
`;
window.customElements.define('test-component', class extends HTMLElement {
	constructor() {super();}
	connectedCallback() {
		this.attachShadow({mode:'open'})
			.appendChild(template.content.cloneNode(true));
	}
});

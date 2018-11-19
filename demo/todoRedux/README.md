# Native Web Application Tutorial

This tutorial demonstrates how to develop a modern web application from vanilla web components with a little help from [ShadowQuery] and [Redux]. The finished demo can be found in [this directory].

The tutorial is the final article of a three part series. [The first part] discusses why I'm doing this and what might be wrong with the currently established way of picking a major framework - a _god framework_ as [this article] nicely puts it. [Part two] is a high level discussion of all the aspects you should think about when _not_ using a framework and instead developing on your own perfect fit stack and mostly native platform technology:

The result is a bleeding edge modern web app, its code comparing favorably to anything written with a god framework, its performance and footprint far better than anything you could dream to achieve with any framework - the whole application comes out of the build including ShadowQuery and Redux at a mere 7.6KB without gzipping. If you must support IE, add 30K for the polyfill.

This tutorial builds upon Redux's standard [todo app tutorial]. If you are not familiar with it, head over there and go through it. I copied the Redux related code as is and won't explain anything related to it. Indeed this tutorial sets in where the Redux tutorial ends: this tutorial replaces the last chapter of the Redux tutorial "Usage with React" starting from section "Implementing Components".

I won't cover web components in any depth. If you are not familiar with their concepts, please consult [Google's guide].

All discussed source code can be found in the [ShadowQuery repository]. There is quite some background to the structure of the source code. Please consult the discussion of app architecture in [part two] of this article series.

# Implementing components

## Implementing Presentational Components

### src/dom/add.js
Our first component is an input with a button that allows you to add a TODO to the list.
```js
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
```
The first line imports ShadowQuery in order to make our life a lot easier. You can do all this without ShadowQuery. It "just" gets a fair bit more verbose. ShadowQuery is mostly a collection of small methods that help avoid boilerplate. In this first example I'll translate ShadowQuery helpers to vanilla so that you can get a feeling for what's happening.

Next line defines the components template. If we were not using ShadowQuery this would become:
```js
const template = document.createElement('template');
template.innerHTML = `...`
```
After that we define our new tag `<sq-todo-add>` as a class that inherits from HTMLElement. The constructor does nothing interesting, but it _must_ always call `super()` which is HTMLElement's constructor.

Now things get a bit more interesting. `connectedCallback` gets called by the platform, when an instance of `<sq-todo-add>` is inserted to the life DOM tree (its constructor gets called first). The method first attaches the components shadow DOM. Without ShadowQuery `$(this).shadow(template);` would become
```js
this.attachShadow({mode: 'open'})
.appendChild(template.content.cloneNode(true));
```
Once the shadow DOM is attached, the component registers event listeners on its DOM. If the user either hits return in the input element or hits the "Add" button, the component's `_add` method is called. Lets consider the button event handler. Without ShadowQuery
```js
$(this, 'button').on('click', this._add.bind(this));
```
would become:
```js
this.shadowRoot.querySelector('input')
.addEventListener('click', this._add.bind(this));
```
Finally when a TODO is to be added, the component emits an event with the current value of the input and resets the input value. Without ShadowQuery `$(this, 'input').prop('value')` would become:
```js
this.shadowRoot.querySelector('input').value
```
and the last line:
```js
this.shadowRoot.querySelector('input').value = ''
```

### src/dom/filter.mjs
The alphabetically next component is the filter radio-like thingy at the bottom that lets you filter what the list of TODO's displays. From here on I'll just explain how things work and won't go into web component basics or ShadowQuery specifics.
```js
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
```
The constructor registers an event handler for when the element's "filter" property changes. Anytime that happens, it removes the "disabled" attribute from all the buttons in its shadow DOM and sets "disabled" for the button with the ID matching the element's filter property. Note how the component does not set the disabled state of its buttons when a filter is clicked. It's always going via the Redux state.

### src/dom/item.mjs
Next in line is the TODO item component, representing one TODO of the list. The template consists of just a `<label>` with acompanying styles. There is an empty space in the label: this is significant, since this is the text node in the DOM where the label string will go.
```js
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
```
When the elements `sqTodo` property changes, the string of the label will be updated and the label's "completed" class will be toggled depending on the TODO item's status.

The event the element emits on click bubbles through shadow DOM boundaries (`composed:true`), so that the TODO app element sitting on top of the whole list can listen to what's going on inside of the list.

If you care, take a second to compare this to the way the Redux/React example works. Try to follow how the click event propagates through the React code: it's really tricky. There are no events but a chain of callbacks that changes method names for each link of the chain. They cannot use event bubbling because the _container_ isn't in the DOM. So they cannot use native tech but need to re-enact an event bubbling chain which is pretty hard to read and hard-coupled while the code above is generic, straightforward to read and loosely coupled.

### src/dom/list.mjs
As I wrote above, you can skip ShadowQuery and just write vanilla code, it's just somewhat more verbose. There is however one thing, where you would need to write a replacement: every once in a while you need to render several nodes from the content of an array. That's no magic, but it's pretty tedious to do manually, as you always _must_ keep track of already rendered nodes.

The TODO list renders TODOs from its 'list' array property. Usually you can use attributes or properties for your component's API. However, when things get more complex - as in the case of an array - you do well to rely on properties.
```js
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
```
ShadowQuery will keep track of nodes rendered for the array and will add or remove nodes as required. In any case it will always call the `update` method (in this case: `this._updateItem`) for each node for the array elements. `<sq-todo-list>` will then update the `sqTodo` property for each of its descendant `<sq-todo-item>`s. `<sq-todo-item>` registered an event listener above for when its `sqTodo` property is set, thus it will update its label's text and `class` attribute according to the received item and either display it stroke through or not.

Imagine the following situation: You see the full TODO list and first half of the items is "completed", the second half "active". Now you click the active filter. The ShadowQuery array handler will remove half the nodes and each of the other half will need to be updated through the update routine I explained above.

And that's it, all presentational components covered!

## Implementing Connectors
Connectors hook up the DOM to the Redux state. The code here is generic and independent of specific DOM, enhancing testability and re-usability.

### src/logic/connectors/reduxConnector.mjs
React comes with a handy `connect` method that helps you to create "containers". Since we are writing vanilla code, we have to write that ourselves. It is another piece of code, that helps reduce boilerplate in other places. You should have something like this in all your projects. It makes the individual connectors much more concise and better readable. And more importantly, should you want to add change detection, this provides a central place where to put it.

The module creates a singleton instance of the Redux store. This module is where _all_ interaction with the store happens (apart from the reducers).

Any ReduxConnector subscribes to the store and provides one method for each way of interactions with the store: _binding_ binds the store's state to the DOM and _dispatcher_ dispatches actions to the store when things happen in the DOM.
```js
import rootReducer from '../reducers/index.mjs';
import {createStore} from '../../../node_modules/redux/es/redux.mjs';

const store = createStore(rootReducer);

export class ReduxConnector {
	constructor(node) {this._$node = node;}

	binding(binding) {
		if(!this._storeToEl) {
			this._storeToEl = [binding];
			store.subscribe(this._onStore.bind(this));
		}
		else this._storeToEl.push(binding);
	}

	dispatcher(evt, action) {
		this._$node.on(evt, evt => {
			const act = action(evt);
			if(act) store.dispatch(act);
		});
	}

	_onStore() {
		if(!this._storeToEl) return;
		const state = store.getState();
		for(let binding of this._storeToEl) {
			this._$node[binding.operation](
				binding.key, this.getPath(binding.path, state)
			);
		}
	}

	getPath(path, state = store.getState()) {
		if(typeof(path) === 'function') return path.call(this, state);
		if(typeof(path) === 'string') path = path.split('.');
		state = state[path[0]];
		return (path.length > 1) ? this.getPath(path.slice(1), state) : state;
	}
}

export default ReduxConnector;
```

### src/logic/connectors/add.mjs
The `add` connector is a one way street. When the "add" event is emitted on its node and the event contains the string of a TODO item to add, it dispatches the `addTodo` action to the store:
```js
export class AddConnector extends ReduxConnector {
	constructor(node) {
		super(node);
		this.dispatcher('add', evt => evt.detail && addTodo(evt.detail));
	}
}
```
This connector will later be wired to `<sq-todo-add>`, which emits an `add` event when its "Add" `<button>` is clicked or the user hits `return` in its `<input>`. This event will thus trigger a Redux state update if the `<input>` contained a value.

### src/logic/connectors/filter.mjs
The filter connects bidirectionally: it propagates the "filter" event to the store, and vice versa propagates the store's `visibilityFilter` state to the DOM:
```js
export class FilterConnector extends ReduxConnector {
	constructor(node) {
		super(node);
		this.binding({path:'visibilityFilter', operation: 'prop', key:'filter'});
		this.dispatcher('filter', evt => setVisibilityFilter(evt.detail));
	}
}
```
This connector will later be wired to the `<sq-todo-filter>`, which emits a `filter` event when one of its buttons is clicked. This event will thus trigger an update of the Redux state. `<sq-todo-filter>` also listens to changes on its filter property. So when the Redux state changes, the `FilterConnector` will update the `filter` property of its assigned node, and thus `<sq-todo-filter>` will call its `update` method to refresh the disabling of its filter buttons.

Therefor clicking a filter button will call a loop through the Redux state which ends up updating the filter button itself.

### src/logic/connectors/list.mjs
Last not least the `ListConnector` is bidirectional, too, propagating TODO status to the store and propagating the TODO list to the DOM. In the latter path it also has some application logic: it filters the TODO list based on the state's `visibilityFilter`:
```js
export class ListConnector extends ReduxConnector {
	constructor(node) {
		super(node);
		this.binding({path:this._getList, operation: 'prop', key:'list'});
		this.dispatcher('toggle', evt => toggleTodo(evt.detail));
	}

	_getList(state) {
		switch (state.visibilityFilter) {
			case 'SHOW_ALL':       return state.todos;
			case 'SHOW_COMPLETED': return state.todos.filter(t => t.completed);
			case 'SHOW_ACTIVE':    return state.todos.filter(t => !t.completed);
			default: throw new Error('Unknown filter: ' + state.visibilityFilter);
		}
	}
}
```
This connector will later be wired to `<sq-todo-list>`, which emits a `toggle` event originating in one of its `<sq-todo-item>`s, when an item is clicked. The event contains the clicked item's ID, for which a `toggleTodo` action is dispatched. Thus clicking an item will update the Redux state.

Now, when the state is updated, `ListConnector` will set the `list` property of its wired `<sq-todo-list>`. `<sq-todo-list>` listens to when its `list` property is set and thus will call its `update` method whenever the state changes and update its shadow DOM as explained above.

## Implementing the Wiring src/app.mjs
Finally the top-level application web component brings everything together. It imports all the top-level DOM components in its shadow DOM and the connectors:
```js
import './dom/add.mjs';
import './dom/list.mjs';
import './dom/filter.mjs';

import {AddConnector}    from './logic/connectors/add.mjs';
import {ListConnector}   from './logic/connectors/list.mjs';
import {FilterConnector} from './logic/connectors/filter.mjs';

import $ from '../node_modules/shadow-query/shadowQuery.mjs';
```
It contains a bit of styling (won't leak out of this shadow DOM tree) to provide
a scrollable TODO list:
```js
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
```
and wires its DOM up to the Redux state using the connectors we defined:
```js
window.customElements.define('sq-todo-app', class extends HTMLElement {
	constructor() {super();}
	connectedCallback() {
		$(this).shadow(template);
		new AddConnector(   $(this, 'sq-todo-add'   ));
		new ListConnector(  $(this, 'sq-todo-list'  ));
		new FilterConnector($(this, 'sq-todo-filter'));
	}
});
```

# Deployment
All of the above works as is in Chrome, and with the polyfill I put in index.html, in other up-to-date browsers, too. However, even for these the code should be minified for deployment, and for IE it requires a bit more. I recommend delivering specific builds to each browser in order to get the best out of the platform. Here I'll just show the full (worst case) IE build.

For IE our beautiful ECMA Script 6 code must be viscously mutilated by babel. The easiest setup is to use babel's `env` preset and configure it in the project's .babelrc:
```json
{"presets": [["@babel/env", {
	"modules": false,
	"targets": {"ie": "11"}
}]]}
```
For this trivial example I wrote the build as a shell script. That way most readers will be able to follow what's happening. I do not recommend this for real world project. Use whatever you're comfortable with, grunt, gulp, webpack, whatever.

First I define a couple of variables to make the script more readable:
```sh
#!/bin/sh

OUT=build/index.html
SRC=src/app.mjs
BUNDLE=build/src/bundle.js
BABELED=build/src/babeled.js
UGLY=build/src/app.js
BIN=./node_modules/.bin
```
Then the real build starts with
1. cleaning up old build
2. bundling
3. babel
4. minification
```sh
rm -rf build

$BIN/rollup   --format iife                        $SRC --file $BUNDLE
$BIN/babel                                         $BUNDLE   > $BABELED
$BIN/uglifyjs --mangle --compress --keep-fnames -- $BABELED  > $UGLY
```
The result of this is inserted directly into the HTML, replacing the original script inclusion line:
```sh
# insert built results into HTML
cp index.html $OUT
sed -i -e 's/<script type="module" src="src\/app.mjs">/<script>\n/' $OUT
sed -i -e "/<script>/ r $UGLY" $OUT
```

# And it ran happily ever after

That's it! The resulting `index.html` is a miniscule but cutting edge web application. It's self contained in an HTML file, you could drop it into a browser as a file without a server.

I hope from this application template you are able to start your own native web application and help change web development for the better: for something that _all_ web developers can follow without training on some god framework first, for a web of truly portable components and unit-testable, profilable and great performing native apps.

If you have any questions or suggestions, please leave a comment under [the original article].

[ShadowQuery]: https://github.com/schrotie/shadow-query
[Redux]: https://redux.js.org/
[this directory]: https://github.com/schrotie/shadow-query/tree/master/demo/todoRedux
[The first part]: https://blog.roggendorf.pro/2018/11/15/web-platform-to-the-rescue/
[Part two]: https://blog.roggendorf.pro/2018/11/17/the-perfect-web-application-framework/
[this article]:  https://www.codemag.com/article/1501101/Why-Micro-JavaScript-Library-Should-Be-Used-in-Your-Next-Application
[todo app tutorial]: https://redux.js.org/basics
[Google's guide]: https://developers.google.com/web/fundamentals/web-components/customelements
[ShadowQuery repository]: https://github.com/schrotie/shadow-query/tree/master/demo/todoRedux
[the original article]: https://blog.roggendorf.pro/2018/11/19/native-web-application-tutorial/

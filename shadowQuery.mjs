/*
 * MIT License - see LICENSE file in same directory
 *
 * Copyright (c) 2018 Thorsten Roggendorf
 */

/**
 * ShadowQuery module.
 * @module shadowQuery
 */


/**
 * ShadowQuery Class. It extends Array, the elements being the nodes
 * selected or passed on initialization.
 * It is exported so that you can extend it or manipulate the prototype
 * or do whatever you like to it.
 */
export class ShadowQuery extends Array {
	/** Instantiate a ShadowQuery object.
	 * Will create an Array (ShadowQuery is an Array!) of nodes from node
	 * parameter.
	 * If selector is passed, will query all nodes passed as node and the
	 * node-array will be the concatenated result of the queries.
	 * Note that for the node parameter, it selects node.shadowRoot by default,
	 * if available. If you want the node and not its shadowRoot, pass ':host'
	 * as selector.
	 * @param {Node|Node[]|NodeList|ShadowQuery|String} node - the initial
	 * node(s)
	 * @param {String=} selector - if passed will query node(s) with selector
	 */
	constructor(node, selector) {
		if(node === 0) return super(0); // eslint-disable-line constructor-super
		let array;
		if(Array.isArray(node)) array = node;
		else if(typeof(node) === 'string') array = [shadowQuery.template(node)];
		else if(node instanceof ShadowQuery) array = node;
		else if(node instanceof NodeList || node instanceof HTMLCollection) {
			array = Array.from(node);
		}
		else array = [node.shadowRoot || node];

		if(selector) array = find(array, selector);
		super(...array);
	}

	/** add a CSS-class to all selected nodes; uses classList.add
	 * @param {string} className - the class to add
	 * @return {ShadowQuery} this for chaining calls
	 */
	addClass(className) {
		for(const node of this) node.classList.add(className);
		return this;
	}

	/**
	 * Insert DOM after all selected nodes
	 * @param {Node|Node[]|ShadowQuery|String|$.template} nodes - DOM to insert;
	 * String will be transformed by calling $.template
	 * $.template is the result of a call to
	 * {@link module:shadowQuery.template $.template}
	 * @return {ShadowQuery} this for chaining calls
	 */
	after(nodes) {
		for(const node of this) {
			const parent = node.parentNode;
			if(node === parent.lastChild) {
				toNodes(parent, nodes, n => parent.appendChild(n));
			}
			else {
				toNodes(
					parent, nodes, n => parent.insertBefore(n, node.nextSibling)
				);
			}
		}
		return this;
	}

	/**
	 * Append DOM to all selected nodes
	 * @param {Node|Node[]|ShadowQuery|String|$.template} nodes - DOM to insert;
	 * String will be transformed by calling $.template
	 * $.template is the result of a call to
	 * {@link module:shadowQuery.template $.template}
	 * @return {ShadowQuery} this for chaining calls
	 */
	append(nodes) {
		for(const node of this) toNodes(node, nodes, n => node.appendChild(n));
		return this;
	}

	/** get or set attribute values. If called with one parameters, will return
	 * the respective attribute value of the first selected element. If called
	 * with two parameters, will set the respective attribute for all selected
	 * elements and return this for chaining.
	 * @example
	 * document.registerElement('hello-world', class extends HTMLElement {
	 * 	constructor() {super();}
	 * 	connectedCallback() {
	 * 		console.log($(this, ':host').attr('hello')); // -> “world?”
	 * 		$(this, ':host').attr('hello', 'world!');
	 * 		console.log($(this, ':host').attr('hello')); // -> “world!”
	 * 	}
	 * });
	 * <hello-world hello="world?"></hello-world>
	 * @param {string} name - attribute name
	 * @param {string=} value - value to set for attribute[name] on all elements;
	 * if undefined or false will call removeAttribute!
	 * @return {ShadowQuery|string} this for chaining or attribute value
	 */
	attr(name, value) {
		if(arguments.length === 1) return this[0] && this[0].getAttribute(name);
		if((value === undefined) || (value === false)) {
			for(const node of this) node.removeAttribute(name);
		}
		else {
			if(typeof(value) !== 'string') value = JSON.stringify(value);
			for(const node of this) node.setAttribute(name, value);
		}
		return this;
	}

	/**
	 * Insert DOM before all selected nodes
	 * @param {Node|Node[]|ShadowQuery|String|$.template} nodes - DOM to insert;
	 * String will be transformed by calling $.template
	 * $.template is the result of a call to
	 * {@link module:shadowQuery.template $.template}
	 * @return {ShadowQuery} this for chaining calls
	 */
	before(nodes) {
		for(const node of this) {
			toNodes(
				node.parentNode, nodes, n => node.parentNode.insertBefore(n, node)
			);
		}
		return this;
	}

	/** check if a selected element has the designated CSS-class ;
	 * uses classList.contains
	 * @param {string} className - the class to check
	 * @return {bool} true if found, else undefined
	 */
	hasClass(className) {
		for(const node of this) {
			if(node.classList.contains(className)) return true;
		}
		return false;
	}

	/**
	 * unregister an event handler on all selected nodes; support attribute
	 * value, property- and text change events (see
	 * {@link module:shadowQuery.ShadowQuery#on ShadowQuery.on});
	 * @param {String} evt event name to pass to removeEventListener. To stop
	 * listening to attribute changes do `attr:name`, for properties `prop:name`,
	 * for text use `text:`
	 * @param {Function} callback function to unregister
	 * @return {ShadowQuery} this for chaining
	 */
	off(evt, callback) {
		for(const node of this) {
			if(/^attr:/.test(evt)) {
				try{node[obsKey(attrFilter(evt))][callback].disconnect();}
				catch(e) {}
			}
			else if(/^prop:/.test(evt)) offProp(node, evt, callback);
			else if(/^text:/.test(evt)) {
				try{node[obsKey(textFilter())][callback].disconnect();}
				catch(e) {}
			}
			else {
				node.removeEventListener(
					evt, callback._shadowQueryNoSelf || callback
				);
			}
		}
		return this;
	}

	/**
	 * register an event handler on all selected nodes
	 *
	 * This is a very powerful utility: you can register standard event handlers.
	 * In this case it's just a shorthand for
	 *
	 * ```js
	 * node.addEventListener(evt, callback)
	 * ```
	 *
	 * However, you can thus also manage attribute-, property- and text event
	 * handlers. Attribute and text event handlers are implemented as
	 * MutationObservers. Property event handlers add getter and setter
	 * methods to the object instance. It is done on the instance and not on the
	 * prototype in order to less likely interfere with getters and setters
	 * implemented in the class. ShadowQuery should - but currently doesn't -
	 * handle those. I recommend not using property event handlers on components
	 * that you do not own yourself. Properties are the most efficient way of
	 * data binding, but they don't support it well. Attribute- and text event
	 * handlers are no problem and should be the preferred way of interacting
	 * with third party components. If an independent or third party component
	 * does use properties to interact with its surrounding - which is perfectly
	 * reasonable - it _should_ emit standart events in order notify client code
	 * of changes.
	 *
	 * Another peculiarity with property event handlers:
	 * When your web component has custom properties, it will usually want to
	 * react to changes of the properties. To this end you implement setter
	 * methods. Now it can happen that something instantiates your element and
	 * sets a property _before_ your element is registered. In these cases the
	 * property will be written as an instance property _over_ the setter method
	 * (which comes later!). This is a trivial problem but easy to miss and
	 * somewhat tedious to work around. If you use `$(this).on('myProperty')`,
	 * ShadowQuery will take care of this for you. However: don't implement
	 * getters and/or setters for you properties, ShadowQuery will do that!
	 * Just register your event handlers with it!
	 *
	 * Quite often an event handler changes something and directly or indirectly
	 * triggers the event, that it handles. The noSelf option helps break this
	 * recursion. noSelf works with all types of event handlers.
	 * @example
	 * $(this, 'button').on(
	 * 	'click',
	 * 	this._onButtonClick.bind(this)
	 * );
	 * $(this, 'button').on(
	 * 	'click',
	 * 	'noSelf',
	 * 	this._onButtonClick.bind(this)
	 * );
	 * $(this, ':host').on(
	 * 	'attr:hello',
	 * 	this._onHelloAtributeChange.bind(this)
	 * );
	 * $(this, ':host').on(
	 * 	'prop:hello',
	 * 	this._onHelloPropertyChange.bind(this)
	 * );
	 * $(this, 'label').on(
	 * 	'text:',
	 * 	this._onLabelTextChange.bind(this)
	 * );
	 * @param {String} evt event name to pass to addEventListener. To listen
	 * to attribute changes do 'attr:name'. This will create a MutationObserver
	 * for changes of the attribute called 'name'. For properties `prop:name`,
	 * for text use `text:`
	 * @param {String|Function} noSelfOrCallback if you want to catch recursive
	 * events pass 'noSelf', otherwise put callback here
	 * @param {Function=} callback function to call on event
	 * @return {ShadowQuery} this for chaining
	 */
	on(evt, noSelfOrCallback, callback) {
		const noself = (arguments.length === 3)&&(noSelfOrCallback === 'noSelf');
		if(arguments.length === 2) callback = noSelfOrCallback;
		for(const node of this) {
			if(/^text:$/.test(evt)) observer(node, noself, callback, textFilter());
			else if(/^attr:/.test(evt)) {
				observer(node, noself, callback, attrFilter(evt));
			}
			else if(/^prop:/.test(evt)) onProp(node, evt, noself, callback);
			else node.addEventListener(evt, noself ? noSelf(callback) : callback);
		}
		return this;
	}

	/**
	 * register an event handler on all selected nodes; support attribute
	 * value, property- and text change events (see
	 * {@link module:shadowQuery.ShadowQuery#on ShadowQuery.on});
	 * callback will be called at most once; Note:
	 * this is called "one" in jQuery. For _once_ I deviate from jQuery since
	 * the name is IMHO a bad choice. Instead I use the better name established
	 * in node.js
	 * @param {String} evt event name to pass to addEventListener. To listen
	 * to attribute changes do 'attr:name'. This will create a MutationObserver
	 * for changes of the attribute called 'name'. For properties `prop:name`,
	 * for text use `text:`
	 * @param {Function} callback function to call on event
	 * @return {ShadowQuery} this for chaining
	 */
	once(evt, callback) {
		for(const node of this) {
			if(/^text:$/.test(evt)) onceObserver(node, callback, textFilter());
			else if(/^attr:/.test(evt)) {
				onceObserver(node, callback, attrFilter(evt));
			}
			else if(/^prop:/.test(evt)) onceProp(node, evt, callback);
			else node.addEventListener(evt, callback, {once: true});
		}
		return this;
	}

	/**
	 * Insert DOM as first content of all selected nodes
	 * @param {Node|Node[]|ShadowQuery|String|$.template} nodes - DOM to insert;
	 * String will be transformed by calling $.template
	 * getTemplate is the result of a call to this.getTemplate
	 * (see {@link module:shadowQuery.template $.template})
	 * @return {ShadowQuery} this for chaining calls
	 */
	prepend(nodes) {
		for(const node of this) {
			if(node.firstChild) {
				toNodes(node, nodes, n => node.insertBefore(n, node.firstChild));
			}
			else toNodes(node, nodes, n => node.appendChild(n));
		}
		return this;
	}

	/** get or set property values. If called with one parameters, will return
	 * the respective property value of the first selected element. If called
	 * with two parameters, will set the respective property for all selected
	 * elements and return this for chaining.
	 * @example
	 * document.registerElement('hello-world', class extends HTMLElement {
	 * 	constructor() {
	 * 		super();
	 * 		this.hello = 'world?'
	 * 	}
	 * 	connectedCallback() {
	 * 		console.log($(this, ':host').prop('hello')); // -> “world?”
	 * 		$(this, ':host').prop('hello', 'world!');
	 * 		console.log($(this, ':host').prop('hello')); // -> “world!”
	 * 	}
	 * });
	 * @param {string} name - property name
	 * @param {string=} value - value to set for node[name] on all elements
	 * @return {ShadowQuery|any} this for chaining or property value
	 */
	prop(name, value) {
		if(arguments.length === 1) return this[0] && this[0][name];
		for(const node of this) node[name] = value;
		return this;
	}

	/**
	 * calls querySelector on all selected nodes and return new ShadowQuery
	 * with the concatenated result. Note that this is analogous to jQuery's
	 * find method. But since ShadowQuery is an Array, this would overwrite
	 * Array.find. Thus I renamed the method to 'query.
	 * @param {String} selector CSS-selector to query
	 * @return {ShadowQuery} new ShadowQuery object with the query-result
	 */
	query(selector) {return new ShadowQuery(find(this, selector));}

	/** Removes matched elements from DOM
	  * @return {ShadowQuery} */
	remove() {
		for(const node of this) node.parentElement.removeChild(node);
		return this;
	}

	/** remove a CSS-class from all selected nodes; uses classList.remove
	 * @param {string} className - the class to remove
	 * @return {ShadowQuery} this for chaining calls
	 */
	removeClass(className) {
		for(const node of this) node.classList.remove(className);
		return this;
	}

	/**
	 * `$(this).shadow(template)` is just a shorthand for
	 * ```js
	 * this.attachShadow(options).appendChild(template)
	 * ```
	 * You will likely do something like this in the majority of your web
	 * component's connectedCallbacks.
	 *
	 * @example
	 * connectedCallback() {$(this).shadow('Hello world!');}
	 * @param {String=} template passed to
	 * {@link module:shadowQuery.template $.template}
	 * @param {Object=} options passed to attachShadow
	 * @return {ShadowQuery} this for chaining
	 */
	shadow(template, options = {mode: 'open'}) {
		for(const node of this) {
			const s = node.attachShadow(options);
			if(template) s.appendChild($.template(template));
		}
		return this;
	}

	/** get or set textNode values. If called without parameters, will return
	 * the respective textNode value of the first selected element. If called
	 * with one parameters, will set the respective textNode value for all
	 * selected elements and return this for chaining.
	 * @example
	 * document.registerElement('hello-world', class extends HTMLElement {
	 * 	constructor() {super();}
	 * 	connectedCallback() {
	 * 		console.log($(this, ':host').text()); // -> “Hello world?”
	 * 		$(this, ':host').text('Hello world!');
	 * 		console.log($(this, ':host').text()); // -> “Hello world!”
	 * 	}
	 * });
	 * <hello-world>Hello world?></hello-world>
	 * @param {String=} t - string to set on nodeValue
	 * @return {ShadowQuery|string} this for chaining or text value
	 */
	text(t) {
		if(!arguments.length) {
			return this[0] && this[0].firstChild && (
				(
					(this[0].firstChild.nodeType === Node.TEXT_NODE) &&
					this[0].firstChild.nodeValue
				) || textNode(this[0]).nodeValue
			);
		}
		for(const node of this) {
			if(node.firstChild && (node.firstChild.nodeType === Node.TEXT_NODE)) {
				node.firstChild.nodeValue = t;
			}
			else textNode(node, true).nodeValue = t;
		}
		return this;
	}

	/** toggle a CSS-class on all selected nodes; uses classList.toggle
	 * @param {string} className - the class to toggle
	 * @param {bool=} state - if true
	 * {@link module:shadowQuery.ShadowQuery#addClass addClass},
	 * if false {@link module:shadowQuery.ShadowQuery#removeClass removeClass}
	 * @return {ShadowQuery} this for chaining calls
	 */
	toggleClass(className, state) {
		if(arguments.length === 1) {
			for(const node of this) node.classList.toggle(className);
		}
		else {
			state = state ? true : false;
			for(const node of this) node.classList.toggle(className, state);
		}
		return this;
	}
}

/** Instantiate a ShadowQuery object. See {@link module:shadowQuery.ShadowQuery}
 * @param {Node|Node[]|NodeList|ShadowQuery} node - the initial node
 * @param {String=} selector - if passed will query node(s) with selector
 * @return {ShadowQuery} instance
 */
export function shadowQuery(node, selector) {
	return new ShadowQuery(node, selector);
}

export default shadowQuery;

const $ = shadowQuery;

function toNodes(parent, nodes, callback) {
	if(nodes instanceof HTMLTemplateElement) {
		return callback(nodes.content.cloneNode(true));
	}
	if(nodes instanceof Node) return callback(nodes);
	if(nodes.constructor === Object) nodes = shadowQuery.template(nodes);
	if(typeof(nodes) === 'function') {
		if(isProcessDynNodes(nodes)) return nodes(parent, callback);
		else return callback(nodes());
	}
	if(!(nodes instanceof Array)) nodes = new ShadowQuery(nodes);
	for(const node of nodes) callback(node);
}

function find(coll, selector) {
	const nodes = [];
	for(let i = 0; i < coll.length; i++) {
		if(/:host/.test(selector)) {for(let sel of selector.split(',')) {
			if(/^\s*:host\s*/.test(sel)) {
				sel = sel.replace(/^\s*:host\s*/, '');
				let host = coll[i].host || coll[i];
				if(typeof(host) === 'string') host = coll[i];
				if(/[^\s]/.test(sel)) nodes.push(...host.querySelectorAll(sel));
				else nodes.push(host);
			}
			else nodes.push(...coll[i].querySelectorAll(sel));
		}}
		else if(coll[i].querySelectorAll) {
			nodes.push(...coll[i].querySelectorAll(selector));
		}
	}
	return nodes;
}

function textNode(node, force) {
	for(let i = 0; i < node.childNodes.length; i++) {
		if(node.childNodes[i].nodeType === Node.TEXT_NODE) {
			return node.childNodes[i];
		}
	}
	if(force) {
		if(console.warn) { // eslint-disable-line no-console
			// eslint-disable-next-line no-console
			console.warn(`ShadowQuery is creating a text node. \
For performance reason you should put the text node into your DOM from the \
start (e.g. as an empty space or zero width space "&#8203;")`);
		}
		node.appendChild(document.createTextNode(''));
		return node.lastChild;
	}
}

// /////// Events //////////

function attrFilter(evt) {
	return {attributes: true, attributeFilter: [evt.replace(/^attr:/, '')]};
}
function textFilter() {return {characterData: true, subtree:true};}

function onceObserver(node, callback, opt) {
	const obs = observer(node, false, function(...rest) {
		obs.disconnect();
		callback(...rest);
	}, opt, callback);
}

function observer(node, noself, callback, opt, origCb = callback) {
	const observer = new MutationObserver(
		noself ? noSelf(callback, true) : callback
	);
	observer.observe(node, opt);
	if(!node[obsKey(opt)]) node[obsKey(opt)] = {[origCb]:observer};
	else node[obsKey(opt)][origCb] = observer;
	return observer;
}
function obsKey(opt) {return `_shadowQueryObserver${JSON.stringify(opt)}`;}

// TODO property handlers should handle getters/setter on the node prototype
function offProp(node, evt, callback) {
	if(!node[propKey(evt)]) return;
	const listener = node[propKey(evt)].listener;
	const idx = listener.indexOf(callback._shadowQueryNoSelf||callback);
	if(idx !== -1) listener.splice(idx, 1);
	if(listener.length) return;
	const value = node[propKey(evt)].value;
	delete node[propKey(evt)];
	const key = evt.replace(/^prop:/, '');
	delete node[key];
	node[key] = value;
}

function onceProp(node, evt, callback) {
	onProp(node, evt, false, _onceListener);
	function _onceListener(...rest) {
		offProp(node, evt, _onceListener);
		callback(...rest);
	}
}
function onProp(node, evt, noself, callback) {
	const pKey = propKey(evt);
	let initialized;
	if(!node[pKey]) node[pKey] = {listener: []};
	else initialized = true;
	node[pKey].listener.push(noself ? noSelf(callback) : callback);
	if(initialized) return;
	const key = evt.replace(/^prop:/, '');
	if(
		(node instanceof HTMLInputElement) &&
		((key === 'value') || (key === 'checked'))
	) onInputValueChange(node, key, pKey, evt);
	else if((node instanceof HTMLSelectElement) && (key === 'value')) {
		onInputValueChange(node, key, pKey, evt);
	}
	onPropertyChange(node, key, pKey);
}
function onInputValueChange(node, key, pKey, evt) {
	const eKey = `${pKey}-Listener`;
	if(node[eKey]) return;
	switch(key) {
	case 'value':
		node[eKey] = true;
		node.addEventListener('change', () => {
			node[pKey].value = node.value;
			tell(node, node[pKey], evt);
		});
		break;
	case 'checked':
		node[eKey] = true;
		node.addEventListener('change', () => {
			node[pKey].checked = node.checked;
			tell(node, node[pKey], evt);
		});
		break;
	}
}
function onPropertyChange(node, key, pKey, evt) {
	if(Object.prototype.hasOwnProperty.call(node, key) ||
		(node[key] !== undefined)
	) {
		node[pKey].value = node[key];
		delete node[key];
	}
	const originalProperty = htmlElementProperty(node, key);
	Object.defineProperty(node, key, {
		get: function() {
			if(originalProperty) return originalProperty.get.call(this);
			return node[pKey].value;
		},
		set: function(value) {
			if(originalProperty) {
				originalProperty.set.call(this, value);
				node[pKey].value = originalProperty.get.call(this);
			}
			else node[pKey].value = value;
			tell(node, node[pKey], evt);
			return value;
		},
		enumerable: true,
		configurable: true,
	});
}
function htmlElementProperty(node, key) {
	try {
		return Object.getOwnPropertyDescriptor(
			Object.getPrototypeOf(node), key
		) ||   Object.getOwnPropertyDescriptor(
			Object.getPrototypeOf(Object.getPrototypeOf(node)), key
		);
	} catch(e) {return undefined;}

}

function propKey(prop) {return `_shadowQueryProp${prop}`;}
function tell(node, prop, evt) {
	for(const listener of prop.listener) listener(prop.value, node, evt);
}

function noSelf(callback, async) {
	let calling;
	return callback._shadowQueryNoSelf = function() {
		if(calling) return;
		calling = true;
		callback();
		if(async) setTimeout(function() {calling = false;});
		else calling = false;
	};
}

// /////// Templates //////////

const templates = {};

/**
 * `$.template` creates an HTMLTemplateElement, initializes it with the passed
 * template string, stores it in its template library, and returns a clone
 * of the content. On subsequent calls, the existing template is efficiently
 * cloned.
 *
 * Instead of template string you can also pass an object in order to generate
 * a dynamic template.
 * Dynamic templates can render arrays and render conditionally. Using
 * dynamic templates together with the ShadowQuery DOM helper insertion
 * functions like `append` allows you to easily manage nodes based on dynamic
 * conditions. Note that when a condition changes to false or an array shrinks,
 * ShadowQuery DOM helper _insertion_ methods will actually _remove_ content
 * instead of _insert_ it. See parameter description for details.
 *
 * @example
 * connectedCallback() {
 * 	$(this).shadow('<ul></ul>');
 * 	$(this, 'ul').append({
 * 		array: () => $(this, ':host').attr('greet').split(),
 * 		template: '<li></li>',
 * 	});
 * }
 * @static
 * @function template
 * @param {String|Object} template - the template string, use Object to define
 * dynamic template
 * @param {Array=} template.array array or function that returns an
 * Array of items to render. If you don't want to use `template.update` you
 * could also just return `{length: 5}` to render 5 nodes; if you just want
 * conditional, you can also skip this; if you want to use the `update` callback
 * with a conditional, you may pass `[item]` so that update gets that item
 * @param {Number=} template.chunks if passed renders `chunks` elements and
 * then calls `setTimeout` before continuing
 * @param {Bool=} template.condition - if false will render nothing
 * @param {Function=} template.done - called when finished; optionally use
 * together with `template.chunks`; `template.done` will never be called, if
 * another dyn-template is rendered before this finished
 * @param {String} template.template - template string for the rendered content
 * @param {Function=} template.update called for each element of the array
 * with two parameters:
 * `template.update(renderedContent, template.array[i])`
 * Note that update may be called asynchronously when using `template.chunks`
 * @param {String=} template.id - key to identify rendered content; only
 * required if you want multiple dynTemplates under the same parent
 * @return {DocumentFragment|dynTemplate} cloned from the created
 * template, or the processor of a DynTemplate if passed an object for a
 * dynamic template.
 */
shadowQuery.template = function(template) {
	if(typeof template === 'string') {
		if(templates[template]) {
			return templates[template].content.cloneNode(true);
		}
		const tmpl = document.createElement('template');
		tmpl.innerHTML = template;
		// document.body.appendChild(tmpl);
		templates[template] = tmpl;
		return tmpl.content.cloneNode(true);
	}
	else if(template instanceof HTMLTemplateElement) {
		return template.content.cloneNode(true);
	}
	else return dynTemplate(template);
};

let processDynNodesRef;
function dynTemplate(template) {
	const {array = [undefined], chunks, id = 'default', update} = template;
	const tmpl = template.template;
	const dynNodeKey = `_shadowQueryChildArrayDynNode${id}`;
	const timeoutKey = `_shadowQueryChildArrayTimeout${id}`;

	function processDynNodes(parent, callback) {
		if(parent[timeoutKey]) {
			clearTimeout(parent[timeoutKey]);
			delete parent[timeoutKey];
		}
		if(!parent[dynNodeKey]) parent[dynNodeKey] =  [];
		const nodes =  parent[dynNodeKey];
		if(
			Object.prototype.hasOwnProperty.call(template, 'condition') &&
			!template.condition
		) return removeNodes(0);
		else if(nodes.length > array.length) removeNodes(array.length);
		iterDynNodeChunk(0);

		function removeNodes(from) {
			for(let i = from; i < nodes.length; i++) {
				for(let j = 0; j < nodes[i].length; j++) {
					parent.removeChild(nodes[i][j]);
				}
			}
			nodes.splice(from);
		}

		function iterDynNodeChunk(idx) {
			if(idx >= array.length) {
				if(template.done) template.done();
				return;
			}
			if(chunks && !(idx % chunks)) {
				parent[timeoutKey] = setTimeout(() => iterNodeArray(idx));
			}
			else {iterNodeArray(idx);}
		}

		function iterNodeArray(idx) {
			let currentNode = parent[dynNodeKey][idx];
			if(!currentNode) {
				const tmp = $.template(tmpl);
				currentNode = $(tmp.childNodes);
				callback(tmp);
				parent[dynNodeKey].push(currentNode);
			}
			if(update) update($(currentNode), array[idx], idx);
			delete parent[timeoutKey];
			iterDynNodeChunk(++idx);
		}
	}
	processDynNodesRef = processDynNodes.prototype.constructor;
	return processDynNodes;
}

function isProcessDynNodes(node) {
	return processDynNodesRef && node && node.prototype &&
		(node.prototype.constructor === processDynNodesRef);
}

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
	 * Will create an Array (this is an Array!) of nodes from node parameter.
	 * If selector is passed, will query all nodes passed as node and the
	 * node-array will be the concatenated result of the queries.
	 * Note that for the node parameter, it selects node.shadowRoot by default,
	 * if available. If you want the node and not its shadowRoot, pass ':host'
	 * as selector.
	 * @param {Node|Node[]|NodeList|ShadowQuery} node - the initial node(s)
	 * @param {String=} selector - if passed will query node(s) with selector
	 */
	constructor(node, selector) {
		let array;
		if(Array.isArray(node)) array = node; // node.map(shadow);
		else if(node instanceof ShadowQuery) array = node;
		else if(node instanceof NodeList || node instanceof HTMLCollection) {
			array = [];
			for(var i = 0; i < node.length; i++) array.push(node[i]);
		}
		else array = [shadow(node)];
		if(selector) array = find(array, selector);
		super(...array);
	}

	/** add a CSS-class to all selected nodes; uses classList.add
	 * @param {string} className - the class to add
	 * @return {ShadowQuery} this for chaining calls
	 */
	addClass(className) {
		for(let node of this) node.classList.add(className);
		return this;
	}

	/**
	 * Insert DOM after all selected nodes
	 * @param {Node|Node[]|ShadowQuery|$.template} nodes - DOM to insert;
	 * $.template is the result of a call to
	 * {@link module:shadowQuery.template $.template}
	 * @return {ShadowQuery} this for chaining calls
	 */
	after(nodes) {
		for(let node of this) {
			if(node === node.parentNode.lastChild) {
				toNodes(node, nodes, n => node.appendChild(n));
			}
			else toNodes(
				node, nodes, n => node.parentNode.insertBefore(n, node.nextSibling)
			);
		}
		return this;
	}

	/**
	 * Append DOM to all selected nodes
	 * @param {Node|Node[]|ShadowQuery|$.template} nodes - DOM to insert;
	 * $.template is the result of a call to
	 * {@link module:shadowQuery.template $.template}
	 * @return {ShadowQuery} this for chaining calls
	 */
	append(nodes) {
		for(let node of this) toNodes(node, nodes, n => node.appendChild(n));
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
			for(let node of this) node.removeAttribute(name);
		}
		else {
			if(typeof(value) !== 'string') value = JSON.stringify(value);
			for(let node of this) node.setAttribute(name, value);
		}
		return this;
	}

	/**
	 * Insert DOM before all selected nodes
	 * @param {Node|Node[]|ShadowQuery|$.template} nodes - DOM to insert;
	 * $.template is the result of a call to
	 * {@link module:shadowQuery.template $.template}
	 * @return {ShadowQuery} this for chaining calls
	 */
	before(nodes) {
		for(let node of this) {
			toNodes(node, nodes, n => node.parentNode.insertBefore(n, node));
		}
		return this;
	}

	/** check if a selected element has the designated CSS-class ;
	 * uses classList.contains
	 * @param {string} className - the class to check
	 * @return {bool} true if found, else undefined
	 */
	hasClass(className) {
		for(let node of this) if(node.classList.contains(className)) return true;
	}

	/**
	 * unregister an event handler on all selected nodes; support attribute
	 * value change events
	 * @param {String} evt event name to pass to addEventListener. To listen
	 * to attribute changes do 'attr:name'. This will create a MutationObserver
	 * for changes of the attribute called 'name'.
	 * @param {Function} callback function to call on event
	 * @return {ShadowQuery} this for chaining
	 */
	off(evt, callback) {
		for(let node of this) {
			if(/^attr:/.test(evt)) {
			// TODO
			// (new MutationObserver(callback)).observe(node,
			// {attributes: true, attributeFilter: [evt.replace(/^attr:/, '')]});
			}
			else node.removeEventListener(evt, callback);
		}
		return this;
	}

	/**
	 * register an event handler on all selected nodes; support attribute
	 * value change events
	 * @example
	 * $(this, 'button').on(
	 * 	'click',
	 * 	this._onButtonClick.bind(this)
	 * );
	 * $(this, ':host').on(
	 * 	'attr:hello',
	 * 	this._onHelloAtributeChange.bind(this)
	 * );
	 * @param {String} evt event name to pass to addEventListener. To listen
	 * to attribute changes do 'attr:name'. This will create a MutationObserver
	 * for changes of the attribute called 'name'.
	 * @param {Function} callback function to call on event
	 * @return {ShadowQuery} this for chaining
	 */
	on(evt, callback) {
		for(let node of this) {
			if(/^attr:/.test(evt)) {
				(new MutationObserver(callback)).observe(node,
				{attributes: true, attributeFilter: [evt.replace(/^attr:/, '')]});
			}
			else node.addEventListener(evt, callback);
		}
		return this;
	}

	/**
	 * register an event handler on all selected nodes; support attribute
	 * value change events; callback will be called at most once; Note:
	 * this is called "one" in jQuery. For once I deviate from jQuery since
	 * the name is IMHO a bad choice. Instead I use the better name established
	 * in node.js
	 * @param {String} evt event name to pass to addEventListener. To listen
	 * to attribute changes do 'attr:name'. This will create a MutationObserver
	 * for changes of the attribute called 'name'.
	 * @param {Function} callback function to call on event
	 * @return {ShadowQuery} this for chaining
	 */
	once(evt, callback) {
		for(let node of this) {
			if(/^attr:/.test(evt)) onceObserver(node, evt, callback);
			else                   onceListener(node, evt, callback);
		}
		return this;
	}

	/**
	 * Insert DOM as first content of all selected nodes
	 * @param {Node|Node[]|ShadowQuery|getTemplate} nodes - DOM to insert;
	 * getTemplate is the result of a call to this.getTemplate
	 * (see {@link module:shadowQuery.template $.template})
	 * @return {ShadowQuery} this for chaining calls
	 */
	prepend(nodes) {
		for(let node of this) {
			if(node === node.parentNode.lastChild) {
				toNodes(node, nodes, n => node.appendChild(n));
			}
			else toNodes(
				node, nodes, n => node.parentNode.insertBefore(n, node.firstChild)
			);
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
		if(arguments.length === 1) return this[0][name];
		if((value === undefined) || (value === false)) {
			for(let node of this) delete node[name];
		}
		else for(let node of this) node[name] = value;
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

	/** remove a CSS-class from all selected nodes; uses classList.remove
	 * @param {string} className - the class to remove
	 * @return {ShadowQuery} this for chaining calls
	 */
	removeClass(className) {
		for(let node of this) node.classList.remove(className);
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
			return this[0] && this[0].childNodes[0] &&
				this[0].childNodes[0].nodeValue;
		}
		for(let node of this) {if(node.childNodes[0]) {
			node.childNodes[0].nodeValue = t;
		}}
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
			for(let node of this) node.classList.toggle(className);
		}
		else {
			for(let node of this) node.classList.toggle(className, state);
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
	if(nodes instanceof Node) return callback(nodes);
	if(typeof(nodes) === 'function') return nodes(parent, callback);
	if(!(nodes instanceof Array)) nodes = new ShadowQuery(nodes);
	for(let node of nodes) callback(node);
}

function find(coll, selector) {
	const nodes = [];
	for(let i = 0; i < coll.length; i++) {
		if(/^\s*:host\s*/.test(selector)) nodes.push(coll[i].host || coll[i]);
		else nodes.push(...coll[i].querySelectorAll(selector));
	}
	return nodes;
}

function onceListener(node, evt, callback) {
	node.addEventListener(evt, _onceListener);
	function _onceListener(...rest) {
		node.removeEventListener(evt, _onceListener);
		callback(...rest);
	}
}

function onceObserver(node, evt, callback) {
	const observer = new MutationObserver(_onceObserver);
	observer.observe(
		node,
		{attributes: true, attributeFilter: [evt.replace(/^attr:/, '')]}
	);
	function _onceObserver(...rest) {
		observer.disconnect();
		callback(...rest);
	}
}

function shadow(node) {return node.shadowRoot || node;}

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
 * 	$.shadow($.template('<ul></ul>');
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
 * @param {String} template.template - template string for the rendered content
 * @param {Function=} template.update called for each element of the array
 * with two parameters:
 * `template.update(renderedContent, template.array[i])`
 * Note that update may be called asynchronously when using `template.chunks`
 * @param {String=} template.id - key to identify rendered content; only required if
 * you want multiple dynTemplates under the same parent
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
	else return dynTemplate(template);
}

function dynTemplate(template) {
	const {array = [undefined], chunks, id = 'default', update} = template;
	const tmpl = template.template;
	const dynNodeKey = `_shadowQueryChildArrayDynNode${id}`;
	const timeoutKey = `_shadowQueryChildArrayTimeout${id}`;

	return function(parent, callback) {
		if(parent[timeoutKey]) {
			clearTimeout(parent[timeoutKey]);
			delete parent[timeoutKey];
		}
		if(!parent[dynNodeKey]) parent[dynNodeKey] =  [];
		let nodes =  parent[dynNodeKey];
		if(template.hasOwnProperty('condition') && !template.condition) {
			return removeNodes(0);
		}
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
			if(idx >= array.length) return;
			if(chunks && !(idx % chunks)) {
				parent[timeoutKey] = setTimeout(() => iterNodeArray(idx));
			}
			else {iterNodeArray(idx);}
		}

		function iterNodeArray(idx) {
			let currentNode = parent[dynNodeKey][idx];
			if(!currentNode) {
				const tmp = $.template(tmpl);
				currentNode = $(tmp.children);
				callback(tmp);
				parent[dynNodeKey].push(currentNode);
			}
			if(update) update($(currentNode), array[idx], idx);
			delete parent[timeoutKey];
			iterDynNodeChunk(++idx);
		}
	};
}

/*
 * `shadowQuery.shadow` is just a shorthand for
 * `this.attachShadow(options).appendChild($.template(template));`. You
 * will likely do something like this in the majority of your web
 * component's connectedCallbacks.
 * @example
 * connectedCallback() {$.shadow(this, 'Hello world!');}
 * @static
 * @function shadow
 * @param {CustomElement} node - usually `this`
 * @param {String|Object} template passed to 
 * {@link module:shadowQuery.template $.template}
 * @param {Object=} options passed to attachShadow
 */
shadowQuery.shadow = function(node, template, options = {mode: 'open'}) {
	node.attachShadow(options).appendChild($.template(template));
}

/*
 * This will create `this._shadowQueryChange = {}` and track changes there.
 * It calls `JSON.stringify(value)` and stores that under `key` for later
 * comparison.
 * @example
 * if($.changed(this, {key: value})) doSomething();
 * @static
 * @function changed
 * @param {Node} node component to work on, usually `this`
 * @return {boolean} true if something changed
 */
shadowQuery.changed = function(node, change) {
	let changed = false;
	if(!node._shadowQueryChanges) node._shadowQueryChanges = {};
	for(let key of Object.keys(change)) {
		const str = JSON.stringify(change[key]);
		if(str !== node._shadowQueryChanges[key]) {
			node._shadowQueryChanges[key] = str;
			changed = true;
		}
	}
	return changed;
};

/**
 * Quite often an event handler changes something and directly or indirectly
 * triggers the event, that it handles. noSelf helps break this recursion.
 * @example
 * this.addEventListener(
 * 	'click',
 * 	$.noSelf(this._handleEvent.bind(this))
 * );
 * @static
 * @function noSelf
 * @param {Function} callback function to call non-recursively
 * @return {undefined} undefined
 */
shadowQuery.noSelf = function(callback) {
	let calling;
	return function() {
		if(calling) return;
		calling = true;
		callback();
		calling = false;
	};
};

/**
 * When your web component has custom properties, it will usually want to
 * react to changes of the properties. To this end you implement setter
 * methods. Now it can happen that something instantiates your element and
 * sets a property _before_ your element is registered. In these cases the
 * property will be written as an instance property _over_ the setter method
 * (which comes later!). This is a trivial problem but easy to miss and
 * somewhat tedious to work around. ShadowQuery to the rescue.
 * @example
 * constructor() {
 * 	super();
 * 	$.properties({hello: 'Hello world!');
 * 	console.log(this.hello); // -> 'Hello world!'
 * }
 * // Do `$.properties({hello: undefined)};` to
 * // bypass default value initialization, but
 * // still keep up with properties set before
 * // registration.
 * @static
 * @function properties
 * @param {Node} node component to initialize, usually `this`
 * @param {Object} properties key-default-value pairs
 * @return {undefined} undefined
 */
shadowQuery.properties = function(node, properties) {
	for(let key of Object.keys(properties)) {
		if(node.hasOwnProperty(key)) {
			const value = node[key];
			delete node[key];
			node[key] = value;
		}
		else {
			const prop = properties[key];
			if(typeof(prop) === 'function') node[key] = prop();
			else if(prop !== undefined) node[key] = prop;
		}
	}
};

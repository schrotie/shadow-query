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
		else if(node instanceof NodeList) {
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
	 * Create an array of nodes under all selected nodes.
	 * @example <caption>Example</caption>
	 * $(this, 'ul').childArray({
	 * 	array:    $(this, ':host').attr('greet').split(),
	 * 	template: () => this.getTemplate('listitem'),
	 * 	update:   (li, item) => li.text(`Hello ${item}!`),
	 * });
	 * @param {Object} opt parameters object
	 * @param {Array} opt.array Array of items to render. If you don't want to
	 * use opt.update you could also just pass {length: 5} to render 5 nodes
	 * @param {Number=} opt.chunks if passed renders chunks elements and then
	 * calls setTimeout before continuing
	 * @param {String=} opt.selector if you want to render into a node that
	 * contains other stuff beside the array elements, you need to pass a
	 * selector, that selects the elements rendered by this.
	 * @param {Function} opt.template a function that returns the content
	 * to be rendered. Usually something like:
	 * () => this.getTemplate('arrayTemplate')
	 * @param {Function=} opt.update called for each element of the array with
	 * two parameters: opt.update(renderedContent, opt.array[i]) Note that update
	 * may be called asynchronously when using opt.chunks
	 * @return {ShadowQuery} this for chaining
	 */
	childArray(opt) {
		for(let node of this) attachNodeArray(node, opt);
		return this;
	}

	/**
	 * Create a child node under all selected nodes only if a condition is
	 * true. Once rendered the method does nothing. It never removes the node.
	 * @example
	 * constructor() {
	 * 	super();
	 * 	$.template(this, {'default':'<ul></ul>', li:'<li></li>'});
	 * }
	 * connectedCallback() {
	 * 	that.attachShadow({mode: open}).appendChild(this.template);
	 * 	$(this, 'ul').deferredChild({
	 * 		array:    $(this, ':host').attr('greet').split(),
	 * 		selector: 'li',
	 * 		template: () => this.getTemplate('li'),
	 * 	});
	 * }
	 * @param {Object} opt parameters object
	 * @param {bool} opt.condition renders if true and node not already there
	 * @param {String} opt.selector must match the created childNode
	 * @param {Function} opt.template a function that returns the content
	 * to be rendered. Usually something like:
	 * () => this.getTemplate('arrayTemplate')
	 * @param {Function=} opt.update called for each element of the array with
	 * two parameters: opt.update(renderedContent, opt.array[i]) Note that update
	 * may be called asynchronously when using opt.chunks
	 * @return {ShadowQuery} this for chaining
	 */
	deferredChild({condition, selector, template, update}) {
		if(condition) {for(let node of this) {
			if(node.querySelectorAll(selector).length) continue;
			const deferred = template();
			node.appendChild(deferred);
			if(update) update(deferred);
		}}
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
	 * register an event handler on all selected nodes; support attribute
	 * value change events
	 * @example
	 * $(this, 'button').on('click', this._onButtonClick.bind(this));
	 * $(this, ':host').on('attr:hello', this._onHelloAtributeChange.bind(this));
	 * @param {String} evt event name to pass to addEventListener. To listen
	 * to attribute changes do 'attr:name'. This will create a MutationObserver
	 * for changes of the attribute called 'name'.
	 * @param {Function} callback function to call on event
	 * @return {ShadowQuery} this for chaining
	 */
	on(evt, callback) {
		for(let node of this) {
			node.addEventListener(evt, callback);
			if(/^attr:/.test(evt)) {
				(new MutationObserver(callback)).observe(node,
				{attributes: true, attributeFilter: [evt.replace(/^attr:/, '')]});
			}
			else node.addEventListener(evt, callback);
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
	 * @param {bool=} state - if true {@link ShadowQuery#addClass addClass},
	 * if false {@link ShadowQuery#removeClass removeClass}
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

/** Instantiate a ShadowQuery object. See {@link ShadowQuery#constructor}
 * @param {Node|Node[]|NodeList|ShadowQuery} node - the initial node
 * @param {String=} selector - if passed will query node(s) with selector
 * @return {ShadowQuery} instance
 */
export function shadowQuery(node, selector) {
	return new ShadowQuery(node, selector);
}

/** Alias for shadowQuery. See {@link ShadowQuery#constructor} */
export const $ = shadowQuery;

function attachNodeArray(node, {array, chunks, selector, template, update}) {
	if(node[timeoutKey(selector)]) {
		clearTimeout(node[timeoutKey(selector)]);
		delete node[timeoutKey(selector)];
	}
	let nodes = $(selector ? node.querySelectorAll(selector) : node.childNodes);
	if(nodes.length > array.length) {
		for(let i = array.length; i < nodes.length; i++) {
			node.removeChild(nodes[i]);
		}
	}
	iterNodeArrayChunk(
		node, nodes, 0, {array, chunks, selector, template, update}
	);
}

function iterNodeArrayChunk(
	node, nodes, idx, {array, chunks, selector, template, update}
) {
	if(idx >= array.length) return;
	if(chunks && !(idx % chunks)) {
		node[timeoutKey(selector)] = setTimeout(function() {
			iterNodeArray(
				node, nodes, idx, {array, chunks, selector, template, update}
			);
		});
	}
	else {iterNodeArray(
		node, nodes, idx, {array, chunks, selector, template, update}
	);}
}

function iterNodeArray(
	node, nodes, idx, {array, chunks, selector, template, update}
) {
	let currentNode = nodes[idx];
	if(!currentNode) {
		node.appendChild(template());
		currentNode = node.lastChild;
	}
	if(update) update($(currentNode), array[idx], idx);
	delete node[timeoutKey(selector)];
	iterNodeArrayChunk(
		node, nodes, ++idx, {array, chunks, selector, template, update}
	);
}

function timeoutKey(sel) {return `_shadowQueryChildArray${sel || ''}`;}

function find(coll, selector) {
	const nodes = [];
	for(let i = 0; i < coll.length; i++) {
		if(/^\s*:host\s*/.test(selector)) nodes.push(coll[i].host || coll[i]);
		else {
			const collection = coll[i].querySelectorAll(selector);
			for(let i = 0; i < collection.length; i++) nodes.push(collection[i]);
		}
	}
	return nodes;
}

function shadow(node) {return node.shadowRoot || node;}


/**
 * `$.template` creates the `this.template` getter and the `this.getTemplate`
 * method. Instead of just passing a string to `$.template` you can also pass
 * an object, if you need more than one template. One of the templates must be
 * `'default'` if you want to use `this.template`.
 * @example
 * constructor() {
 * 	super();
 * 	$.template(this, {'default':'<ul></ul>', li:'<li></li>'});
 * }
 * connectedCallback() {
 * 	that.attachShadow({mode: open}).appendChild(this.template);
 * 	$(this, 'ul').deferredChild({
 * 		array:    $(this, ':host').attr('greet').split(),
 * 		selector: 'li',
 * 		template: () => this.getTemplate('li'),
 * 	});
 * }
 * @static
 * @function template
 * @param {Node} node - the initial node, usually `this`
 * @param {String|Object} template - the template string, use Object to
 * initialize several templates
 */
shadowQuery.template = function(node, template) {
	if(node.getTemplate) return;
	if(typeof(template) === 'string') template = {'default': template};
	createTemplate(template);
	node.constructor.prototype.getTemplate = function(name = 'default') {
		return template[name].content.cloneNode(true);
	};
	Object.defineProperty(node.constructor.prototype, 'template', {
		get: function() {return this.getTemplate();},
	});
};

function createTemplate(template) {
	for(let name of Object.keys(template)) {
		const tmpl = document.createElement('template');
		tmpl.innerHTML = template[name];
	// document.body.appendChild(tmpl);
		template[name] = tmpl;
	}
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
 * this.addEventListener('click', $.noSelf(this._handleEvent.bind(this)));
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
 * // Do `$.properties({hello: undefined)};` to bypass default value
 * // initialization, but still keep up with properties set before registration.
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

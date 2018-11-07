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
 * `'default'` if you want to use `this.template`. The this.getTemplate method
 * accepts two parameters. The first is the template name - defaulting to
 * 'default', the second is an optional patch. If the template you get is
 * a dynamic template, you can pass patch to patch the definition of the
 * template. This allows you to pass things like array and condition where
 * you dynamically determine them instead of taking the roundtrip via 'this'
 * and use methods on the template to yield these dynamic values.
 *
 * @example
 * constructor() {
 * 	super();
 * 	$.template(this, {
 * 		'default':'<ul></ul>',
 * 		items: {
 * 			array: () => $(this, ':host').attr('greet').split(),
 * 			template: 'li',
 * 		},
 * 		li:'<li></li>'
 * 	});
 * }
 * connectedCallback() {
 * 	that.attachShadow({mode: open}).appendChild(this.template);
 * 	$(this, 'ul').append(this.getTemplate('items'));
 * }
 * @static
 * @function template
 * @param {Node} node - the initial node, usually `this`
 * @param {String|Object} template - the template string, use Object to define
 * several templates
 * @param {String|Object} template.* - the template string, use Object to
 * define dynamic templates
 * @param {Array|Function=} template.*.array array or function that returns an
 * Array of items to render. If you don't want to use template.update you could
 * also just return {length: 5} to render 5 nodes
 * @param {Number=} template.*.chunks if passed renders chunks elements and
 * then calls setTimeout before continuing
 * @param {Bool|Function=} template.*.condition - a function that is optionally
 * called to determine wether to render (if truthy)
 * @param {String} template.*.template - a string that is the key of another
 * template defined in the same call to $.template
 * @param {Function=} template.*.update called for each element of the array
 * with two parameters: template.*.update(renderedContent, opt.array[i]) Note
 * that update may be called asynchronously when using opt.chunks
 */
shadowQuery.template = function(node, template) {
	if(node.getTemplate) return;
	if(typeof(template) === 'string') template = {'default': template};
	createTemplate(node, template);
	node.constructor.prototype.getTemplate = function(name = 'default', patch) {
		if(patch && template[name].patch) return template[name].patch(patch);
		if(template[name] instanceof DynTemplate) return template[name].process;
		return template[name].content.cloneNode(true);
	};
	Object.defineProperty(node.constructor.prototype, 'template', {
		get: function() {return this.getTemplate();},
	});
};

function createTemplate(node, template) {
	for(let name of Object.keys(template)) {
		if(typeof template[name] === 'string') {
			const tmpl = document.createElement('template');
			tmpl.innerHTML = template[name];
		// document.body.appendChild(tmpl);
			template[name] = tmpl;
		}
		else template[name] = new DynTemplate(node, template[name], name);
	}
}

class DynTemplate {
	constructor(node, template, key) {
		this._node = node;
		this._template = this.__template = template;
		this._key = key;
		this.process = this._unpatched.bind(this);
		this.__patched = this._patched.bind(this);
	}

	patch(patch) {
		this.__template = Object.assign(patch, this._template);
		return this.__patched;
	}

	_unpatched(parent, callback) {
		this._attachDynNodes(this._template, parent, callback);
	}

	_patched(parent, callback) {
		this._attachDynNodes(this.__template, parent, callback);
	}

	_attachDynNodes(tmpl, parent, callback) {
		const array = this._getArray(tmpl);
		if(parent[this._timeoutKey]) {
			clearTimeout(parent[this._timeoutKey]);
			delete parent[this._timeoutKey];
		}
		if(!parent[this._dynNodeKey]) parent[this._dynNodeKey] =  [];
		let nodes =  parent[this._dynNodeKey];
		if(!this._condition(tmpl)) return this._removeNodes(parent, 0, nodes);
		else if(nodes.length > array.length) {
			this._removeNodes(parent, array.length, nodes);
		}
		this._iterDynNodeChunk(0, tmpl, array, parent, callback);
	}

	_getArray(template) {
		if(!template.array) return [undefined];
		if(typeof(template.array) === 'function') return template.array();
		return template.array;
	}

	_condition(tmpl) {
		return !tmpl.hasOwnProperty('condition') || (
			(typeof(tmpl.condition) === 'function') ?
			tmpl.condition() : tmpl.condition
		);
	}

	_removeNodes(parent, from, nodes) {
		for(let i = from; i < nodes.length; i++) {
			for(let j = 0; j < nodes[i].length; j++) {
				parent.removeChild(nodes[i][j]);
			}
		}
		nodes.splice(from);
	}

	_iterDynNodeChunk(idx, tmpl, array, parent, callback) {
		const {chunks} = tmpl;
		if(idx >= array.length) return;
		if(chunks && !(idx % chunks)) {
			parent[this._timeoutKey] = setTimeout(() => {
				this._iterNodeArray(idx, tmpl, array, parent, callback);
			});
		}
		else {this._iterNodeArray(idx, tmpl, array, parent, callback);}
	}

	_iterNodeArray(idx, tmpl, array, parent, callback) {
		let {template, update} = tmpl;
		let currentNode = parent[this._dynNodeKey][idx];
		if(!currentNode) {
			template = this._node.getTemplate(template);
			currentNode = $(template.children);
			callback(template);
			parent[this._dynNodeKey].push(currentNode);
		}
		if(update) update($(currentNode), array[idx], idx);
		delete parent[this._timeoutKey];
		this._iterDynNodeChunk(++idx, tmpl, array, parent, callback);
	}

	get _dynNodeKey() {return `_shadowQueryChildArrayDynNode${this._key}`;}
	get _timeoutKey() {return `_shadowQueryChildArrayTimeout${this._key}`;}
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

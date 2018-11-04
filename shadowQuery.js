/*
 * MIT License - see LICENSE file in same directory
 *
 * Copyright (c) 2018 Thorsten Roggendorf
 */

class ShadowQuery extends Array {
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

	addClass(className) {
		for(let node of this) node.classList.add(className);
		return this;
	}

	attr(name, value) {
		if(arguments.length === 1) return this[0].getAttribute(name);
		if((value === undefined) || (value === false)) {
			for(let node of this) node.removeAttribute(name);
		}
		else {
			if(typeof(value) !== 'string') value = JSON.stringify(value);
			for(let node of this) node.setAttribute(name, value);
		}
		return this;
	}

	childArray(opt) {
		for(let node of this) attachNodeArray(node, opt);
		return this;
	}

	deferredChild({condition, selector, template, update}) {
		if(condition) for(let node of this) {
			if(node.querySelectorAll(selector).length) continue;
			const deferred = template();
			node.appendChild(deferred);
			if(update) update(deferred);
		}
		return this;
	}

	hasClass(className) {
		for(let node of this) {
			if(node.classList.contains(className)) return true;
		}
	}

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

	prop(name, value) {
		if(arguments.length === 1) return this[0][name];
		if((value === undefined) || (value === false)) {
			for(let node of this) delete node[name];
		}
		else for(let node of this) node[name] = value;
		return this;
	}

	query(selector) {return new ShadowQuery(find(this, selector));}

	removeClass(className) {
		for(let node of this) node.classList.remove(className);
		return this;
	}

	text(t) {
		for(let node of this) node.childNodes[0].nodeValue = t;
		return this;
	}

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

export function shadowQuery(node, selector) {
	return new ShadowQuery(node, selector);
}

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
	else iterNodeArray(
		node, nodes, idx, {array, chunks, selector, template, update}
	);
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

shadowQuery.template = function(node, template) {
	if(node.getTemplate) return;
	if(typeof(template) === 'string') template = {'default': template};
	createTemplate(template);
	node.constructor.prototype.getTemplate = function(name = 'default') {
		return template[name].content.cloneNode(true);
	};
	Object.defineProperty(node.constructor.prototype, 'template', {
		get: function() { return this.getTemplate(); },
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

shadowQuery.noSelf = function(callback) {
	let calling;
	return function() {
		if(calling) return;
		calling = true;
		callback();
		calling = false;
	};
};

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

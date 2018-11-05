# shadow-query
Nano sized utilities library for writing vanilla web components

ShadowQuery is a tiny (1.5k uglified gzip as of this writing) utility library to help develop high performance vanilla web components. Some of its API syntax is reminiscent of web dev warhorse jQuery, adapted for working with Shadow DOM, hence the name.

__Tiny__: demo/dbmonster.html is a selfcontained HTML app _below 10K_ (load without server into your Chrome or Firefox, for other browsers you may need to add more polyfills).

__High Performance__: shadow-query dbmonster ist among the fastest dbmonsters out there, one of the lowest memory footprints.

... _and all that at 100 lines of nicely structured code plus templates_

```html
<!DOCTYPE html>
<html>
	<head><script type="module">
		import {$} from '/node_modules/shadow-query/shadowQuery.js';

		const template = `
		<style>:host {cursor: pointer; font-family: sans-serif;}</style>
		<h3><slot></slot></h3>
		<ul></ul>
		`;
		const listItem = `<li> </li>`;

		window.customElements.define('hello-world', class extends HTMLElement {
			constructor() {
				super();
				$.template(this, {'default': template, listItem});
				$(this).on('click', () => alert('ShadowQuery loves you!'));
			}
			connectedCallback() {
				this.attachShadow({mode: 'open'}).appendChild(this.template);
				$(this, 'ul').childArray({
					array   : $(this, ':host').attr('greet').split(' '),
					template: (        ) => this.getTemplate('listItem'),
					update  : (li, item) => li.text(`Hello ${item}!`),
				});
			}
		});
	</script></head>
	<body><hello-world greet="Angular React Vue">Greetings!</hello-world></body>
</html>
```
This works as is in Chrome, for other browsers you may need to load polyfills until they fully support the standart. Everything that starts with `$` above is ShadowQuery, the rest ist standart tech. The result of the above is:
### Greetings!
* Hello Angular!
* Hello React!
* Hello Vue!

# Status

ShadowQuery is currently a proof of concept. I have developed one smallish (1.5k lines) web application on it. No tests, no proven tech, an experiment.

# Intended Audience

If you're the ~~Visual Basic~~ Angular/React kind of dev, ShadowQuery is not for you. It does not take your hand, it does not structure your project. ShadowQuery is for you (or would be if it had outgrown experimental status), if you like to be in control, if you know what you do. It has zero magic, no surprises … actually, one thing did surprise me: you really need very little utility to empower you to write vanilly web components and make full use of the platform.

# Motivation

So I was writing this web app of mine, starting from vanilla web components. As I expected I soon reached a point where the platform technology needs significant enhancement in order to get good results. `this.shadowRoot.innerHTML = template` doesn't kick it for several reasons, performance being just one - e.g. you get unusable UX in many situations if this is all you ever do.

So I decided to give lit-html a shot. It comes from the Polymer developers whom I respect a lot for what they have done on Polymer. When my app was done I was somewhat unimpressed. Performance was mediocre considering my little app, footprint was pretty cool. The performance nagged at me, though, a bigger app could easily get into troubled waters (it's on par with Polymer, but I was expecting more).

And the syntax was also okayish. I didn't like, that it injects its idiom into my templates with attribute- and event bindings and more. Then I had the idea to try my own thing, add some jQuery like syntactic sugar and went to bed with the vision of the army of aged jQuery devs embracing my ShadowQuery and making me rich and famous.

Next day I implemented the proof of concept and migrated my app. When I was done I was quite happy to find that performance _and_ footprint were dramatically improved over lit-html. The code size of components written with ShadowQuery even became slightly smaller, insignificantly so, though.

More importantly, I really like how ShadowQuery makes it obvious what's going on. With template utilities like lit-html you write complex templates intermingled with Javascript. On updates you re-render that template, but it's somewhat hard to grasp what's going on then.  Mixing imperative code into a declarative template may not be the ideal programming paradigm … at least to me.

Oh, did I mention that ShadowQuery supports you through the whole nine yards, not just with updating your template (which it, strictly speaking, doesn't do, at all)?

# Installation
```sh
npm i -s 'shadow-query'
```
# Hello world!

## Vanilla Web Component
```js
document.registerElement('hello-world', class extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		that.attachShadow({mode: open}).innerHTML = 'Hello world!';
	}
});
```
## ShadowQuery
```js
import {$} from '/node-modules/shadow-query/shadowQuery.js';
document.registerElement('hello-world', class extends HTMLElement {
	constructor() {
		super();
		$.template(this, 'Hello world!');
	}
	connectedCallback() {
		that.attachShadow({mode: open}).appendChild(this.template);
	}
});
```

The difference is that ShadowQuery takes the template, creates an HTMLTemplateElement only once regardless of how many instances of hello-world are created and provides a native clone of that template when you call the getter `this.template`. This is a lot more efficient than setting `innerHTML`.

# API

The ShadowQuery module has two exports. Both are the same, just the names differ. One is `shadowQuery`, the other is for good old time's (and brevity's) sake `$`.

There are two types of APIs in ShadowQuery. There are static methods like `$.template`. All of these do something to your component-class. `$` is also a function that facilitates working with the DOM.

jQuery works on the document, ShadowQuery is for web components which work on document-fragments. Thus all ShadowQuery methods expect an entry node (or several) as first argument.

## Templates

You already saw this in the hello world example. `$.template` creates the `this.template` getter and the `this.getTemplate` method. Instead of just passing a string to `$.template` you can also pass an object, if you need more than one template. One of the templates must be `'default'` if you want to use `this.template`:

```js
constructor() {
	super();
	$.template(this, {'default':template, deferredTemplate});
}
```

Now you can do `this.getTemplate('deferredTemplate')` if you want to attach something to your DOM at a later point ... we'll come to that.

## Text Values and Chaining

So far didn't look like jQuery at all, I know. We're getting there:

```js
// First define the template. ShadowQuery never does anything to it, it's all vanilla:
const template = `
<style>
	span.checked {background: green;}
</style>
<span>Hello world?</span>`;

document.registerElement('hello-world', class extends HTMLElement {
	constructor() {
		super();
		$.template(this, template);
	}
	connectedCallback() {
		// should always do this, nodes can be connected several times!
		if(this.shadowRoot) return;
		that.attachShadow({mode: open}).appendChild(this.template);
		$(this, 'span').text('Hello world!').toggleClass('checked');
	}
});
```

The `$` method always expects a node as first argument and an optional selector as its second. It calls `(node.shadowRoot || node).querySelectorAll(selector)` and returns its DOM swiss army knife that let's you do various stuff on the result similar to jQuery. In fact, if you are familiar with jQuery you should feel pretty much at home. Be aware, though, that ShadowQuery is a tiny subset of jQuery. The former was a compatibility layer as much as a utility and it filled many holes in the platform that the platform has meanwhile caught up upon.

The example calls two methods in a chain: first `text` for each selected node calls `node.childNodes[0].nodeValue = text`, `text` being "Hello world!" in the example. Note that it brutally calls `childNodes[0]` if you call `text`. What it does is by far the best performing approach to change character-data in the DOM. This only works, if there already is a textNode there. In this case there is: "Hello world?" in the template. Usually I just leave an empty space where I want to manipulate nodeValues later, like so:

```html
<span> </span> <!-- works,  can   call text on span -->
<span></span>  <!-- breaks, can't call text on span -->
```

You may also use zero-width-space: `&#8203;`. This is an important point: if you want to put text into your template/shadowDOM, you have to create a textNode for it. ShadowQuery doesn't do that for you. It's just a space, but it is significant. By the way: lit-html creates two comment nodes and a text node in such instances, so ShadowQuery is more efficient there, but it only works if you take care of it. ShadowQuery is just a collection of shorthand methods and no nanny. jQuery is a lot more powerful there, too, doing all kinds of magic. I want ShadowQuery to be my bare metal web component utility workbench, not more - and no surprises, no strings attached (pun intended).

So the example first calls `text`, which like all the DOM utilities returns a chainable reference to itself in most cases. If you call `text` without arguments, it will return the text of the first matched element (like jQuery). Here we manipulate, though, and get a chainable result on which (i.e. on the same `span` element in this case) on which `toggleClass` is called. `toggleClass` is like jQuerie's `toggleClass`, but it is just a shorthand for `node.classList.toggle`. If your browser does not support `classList` (_you know who ..._) you're screwed. Well, actually you're not screwed but required to load the respective polyfill. But you know, no nanny and blah ...


## Component Attributes

In many cases web components interface with their surroundings through attributes. ShadowQuery helps with that:

```js
document.registerElement('hello-world', class extends HTMLElement {
	constructor() {
		super();
		 // Creates an attribute mutation observer.
		$(this).on('attr:hello', this._onHello.bind(this));
	}
	_onHello() {
		console.log($(this, ':host').attr('hello')); // -> “world?”
		$(this, ':host').attr('hello', 'world!');
		console.log($(this, ':host').attr('hello')); // -> “world!”
	}
});
```
```html
<hello-world hello="world?"></hello-world>
```
There's a gotcha here: When you pass a node to `$` ShadowQuery selects its `shadowRoot` by default. In most cases, that's what you want, register event handlers on shadow DOM, traverse and manipulate it. In the cases where you don't want that, i.e. when you want to work with the host node, you have to explicitly select it using the `:host` selector. Note that in the constructor this is not necessary, since that is always called before the `shadowRoot` is attached.


## Arrays

This is somewhat of an acid test for code dealing with web components: every once in a while you need to render data that comes in an array and now you need to somehow iterate it and create DOM from it. If you used `innerHTML = template`, this is where you break, because a scrolled view will jump to the top if you do this. Here's ShadowQuery's take on the matter. This is also a slightly more involved example that brings together several features of ShadowQuery:
```js
const template = '<ul></ul>';
const listitem = '<li> </li>'; // Space -> textNode!
document.registerElement('hello-framework', class extends HTMLElement {
	constructor() {
		super();
		$.template(this, {'default': template, listitem});
		$(this).on('attr:greet', this._update.bind(this));
	}

	connectedCallback() {
		if(this.shadowRoot) return;
		this.attachShadow({mode: open}).appendChild(this.template);
		this._update();
	}

	_update() {
		$(this, 'ul').childArray({
			array:    $(this, ':host').attr('greet').split(),
			template: () => this.getTemplate('listitem'),
			update:   (li, item) => li.text(`Hello ${item}!`),
		});
	}
});
```
```html
<hello-framework greet="Angular React Vue"></hello-framework>
```
Result:
- Hello Angular!
- Hello React!
- Hello Vue!

# More

`childArray` can do it bit more, chunked rendering for example. For this and a more helpers/features please refer to the API reference. To view it:
```sh
git clone https://github.com/schrotie/shadow-query
cd shadow-query
npm install
npm run-script build-doc
```
And then open shadow-query/documentation/index.html in your browser.


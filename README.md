# shadow-query
Micro-library for writing vanilla web components

ShadowQuery is a tiny (2k uglified gzip, some 350 lines of code without comments and new lines as of this writing) utility library to help develop high performance vanilla web components. Some of its API syntax is reminiscent of web dev warhorse jQuery, adapted for working with Shadow DOM, hence the name.

__Tiny__: demo/dbmonster.html is a selfcontained HTML app _below 10K_ (load without server into your Chrome or Firefox, for other browsers you may need to add more polyfills).

__High Performance__: shadow-query dbmonster is among the fastest dbmonsters out there, one of the lowest memory footprints.

... _and all that at 100 lines of nicely structured code plus templates_

```html
<!DOCTYPE html>
<html>
	<head><script type="module">
		import $ from '../shadowQuery.mjs';

		const template = `
			<style>:host {
				cursor: pointer;
				font-family: sans-serif;
			}</style>
			<h3><slot></slot></h3>
			<ul></ul>
		`;

		window.customElements.define('hello-framework', class extends HTMLElement {
			constructor() {
				super();
				$(this).on('click', () => alert('ShadowQuery loves you!'));
			}
			connectedCallback() {
				$(this).shadow(template);
				$(this, 'ul').append({
					array   : $(this, ':host').attr('greet').split(' '),
					template: '<li> </li>',
					update  : (li, item) => li.text(`Hello ${item}!`),
				});
			}
		});
	</script></head>
	<body>
		<hello-framework greet="Angular React Vue">Greetings!</hello-framework>
	</body>
</html>
```
This works as is in Chrome, for other browsers you may need to load polyfills until they fully support the standart. Everything that starts with `$` above is ShadowQuery, the rest ist standart tech. The result of the above is:
### Greetings!
* Hello Angular!
* Hello React!
* Hello Vue!

... and that example renders so fast, it's hard to find the 3ms time for rendering between the other stuff Chrome does on page start up.

# Status

ShadowQuery is currently a proof of concept. I have developed one smallish (1.5k lines) web application on it. ShadowQuery now comes with a test suite that covers 100% of the lines of code. I would not recommend it for production, it needs more testing.

# Intended Audience

If you're the ~~Visual Basic~~ Angular/React kind of dev, ShadowQuery is not for you. It does not hold your hand, it does not structure your project. ShadowQuery is for you (or would be if it had outgrown experimental status), if you like to be in control, if you know what you're doing. It has zero magic, no surprises … actually, one thing did surprise me: you really need very little utility to empower you to write vanilly web components and make full use of the platform.

# Motivation

So I was writing this web app of mine, starting from vanilla web components. At some point I pulled in a templating library and in the end was unhappy with the result (custom template syntax and performance). So I started implementing my own helpers which ultimately led to ShadowQuery.

These past five years I have grown increasingly suspicious of the dynamic templating done in Angular/React/Vue and almost any modern framework. Dynamic templating has become a universal pattern of modern web development. I'm not entirely sure that this is the right way to. Templates and components I have no doubt about, at all, "just" these templates with injected JavaScript. I have laid out my thoughts in more detail [here](https://medium.com/@schrotie/web-platform-to-the-rescue-c81719dd6f58).

But dynamic templates are so damn convenient. I had to find out what's necessary to work without them. Turns out: a puny 350 lines of generic helper code, that's mostly straightforward shorthand for things already on the platform plus a bit of array and conditional templating. And this tiny bit of code did not just keep me barely afloat: Components written with it are concise, expressive and very readable and maintainable and - if done right - leave any framework-developed app yelping in the dust with regards to footprint an performance. Most importantly: any web developer with some worthwhile experience of working with actual DOM and Javascript can tell immediately what's going on.

So that is ShadowQuery: A showcase and plea for another approach to web development. It's so tiny that there's little hurdle to using it. Costs next to nothing footprint-wise and if it breaks on you, you can easily fix it, 'cause it's just 350 lines. If you think the approach sounds interesting but don't like ShadowQuerie's syntax: great! Write your own, it's surprisingly simple.

Maybe it will eventually grow to to 3K but I currently consider it complete (feature-wise, still needs more testing, fixing, syntax may change ...). The trick is: it covers the most common use case and simplifies DOM access for anything else. I won't for example implement inline style manipulation, because I consider it bad practice. But doing
```js
$(this, 'a').forEach(a => a.style.textDecoration = 'none');
// or:
$(this, '#myLink')[0].style.textDecoration = 'none';
```
is still simple, and if you want, it's easy to `import {ShadowQuery} from '...'` and manipulate the prototype to support
```js
$(this, 'a').css({textDecoration:'none'});
```

# Installation
```sh
npm i -s 'shadow-query'
```
I recommend cloning the repository in order to get to the full API reference - see bottom of this README.

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
import $ from '../shadowQuery.mjs';
window.customElements.define('hello-world', class extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		$(this).shadow('Hello world!');
	}
});
```

The difference is that ShadowQuery takes the template, creates an HTMLTemplateElement only once regardless of how many instances of hello-world are created and provides a native clone of that template. This is a lot more efficient than setting `innerHTML`.

# API

The ShadowQuery module has two exports. The first is `ShadowQuery`. You should only use it, if you want to modify/extend shadowQuery. The other export '`shadowQuery`' is also the default export. Thus `import {shadowQuery} ...` and `import shadowQuery ...` both work. I usually do `import $ ...` for brevity's sake.

So lets assume you did `import $ from '.../shadowQuery.mjs';`. Now `$` is a function that takes one or two arguments and returns a `new ShadowQuery`.
jQuery works on the document, ShadowQuery is for web components which work on document-fragments. Thus the first arguments is always an entry node (or several). The second is an optional selector. If you pass the selector the result will be that of querying the entry nodes for the selector, otherwise the result is the entry node(s). Anyway, what you get is an Array (ShadowQuery extends Array!) of nodes augmented with a couple of methods to simplify your web component developer life.

The whole DOM API has 5 types of methods:
* __query__  
`constructor`, `query`
* __className__  
`addClass`, `removeClass`, `hasClass`
* __node insertion__  
`append`, `prepend`, `before`, `after`, `shadow`
* __value accessors__  
`attr`, `prop`, `text`
* __event management__  
`on`, `off`, `once`

Node insertion supports templates, and templates support conditional- and array-nodes. Whenever you pass a string to an insertion method, ShadowQuery will create a HTMLTemplateElement, if it does not find it in its library, and furtheron generates clones from that template.

Event management and accessors are symmetric: besides "normal" events you can register attribute, property, and text-events. ShadowQuery value accessors and event management combined provide a complete toolkit for two-way data binding. I do not recommend that, though, for anything but the smallest applications. Usually you should use something like Redux and its one way binding philosophy. However, many generic components will need to react to _their_ attribute and/or property changes and ShadowQuery has everything you need for this.

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
	constructor() {super();}
	connectedCallback() {
		// should always do this, nodes can be connected several times!
		if(this.shadowRoot) return;
		$(this).shadow(template);
		$(this, 'span').text('Hello world!').toggleClass('checked');
	}
});
```

`$(this).shadow(template)` is just a shorthand for
```js
this.attachShadow({mode: open}).appendChild($.template(template))
```
Not much, but since it's used in most components ...

The `$` method always expects a node as first argument and an optional selector as its second. It calls `(node.shadowRoot || node).querySelectorAll(selector)` and returns its DOM swiss army knife that let's you do various stuff on the result similar to jQuery. In fact, if you are familiar with jQuery you should feel pretty much at home. Be aware, though, that ShadowQuery is a tiny subset of jQuery. The former was a compatibility layer as much as a utility and it filled many holes in the platform that the platform has meanwhile caught up upon ... and ShadowQuery aims to be minimal and _only_ address the most common web component use cases.

The example calls two methods in a chain: first `text` for each selected node calls `node.childNodes[0].nodeValue = text`, `text` being "Hello world!" in the example. Note that it brutally calls `childNodes[0]` if you call `text`. What it does is by far the best performing approach to change character-data in the DOM. This only works, if there already is a textNode there. In this case there is: "Hello world?" in the template. Usually I just leave an empty space where I want to manipulate nodeValues later, like so:

```html
<span> </span> <!-- works,  can   call text on span -->
<span></span>  <!-- breaks, can't call text on span -->
```

You may also use zero-width-space: `&#8203;`. This is an important point: if you want to put text into your template/shadowDOM, you have to create a textNode for it. ShadowQuery doesn't do that for you. It's just a space, but it is significant. ShadowQuery is just a collection of shorthand methods and no nanny. jQuery is a lot more powerful there, doing all kinds of magic. I want ShadowQuery to be my bare metal web component utility workbench, not more - and no surprises, no strings attached (pun intended).

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
window.customElements.define('hello-framework', class extends HTMLElement {
	constructor() {super();}
	connectedCallback() {
		$(this).shadow('<ul></ul>');
		$(this, 'ul').append({
			array   : $(this, ':host').attr('greet').split(' '),
			template: '<li> </li>',
			update  : (li, item) => li.text(`Hello ${item}!`),
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

Dynamic templates can do a bit more, chunked and/or conditional rendering for example. For this and a more helpers/features please refer to the API reference. To view it:
```sh
git clone https://github.com/schrotie/shadow-query
cd shadow-query
npm install
npm run-script build-doc
```
And then open shadow-query/documentation/index.html in your browser (without server). The API reference is included in the npm package.

Also checkout the demo directory that comes with the git clone. It contains a few examples on how to use ShadowQuery. Most notably, demo/todoRedux/ contains a [tutorial](https://blog.roggendorf.pro/2018/11/19/native-web-application-tutorial/) on how to develop modern native web applications.

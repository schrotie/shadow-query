[Content] [Next]

# Tutorial 1: Hello world!

Play with the "Hello world!" demo at [codepen](https://codepen.io/schrotie/pen/rQYZae).

[This] is web component 101. The codepen lets you compare vanilla hello world to ShadowQuery. Both are identical except for how the shadow DOM is initialized. You will want to follow these steps for any web component you develop:

1. Define you element with `customElements.define`, naming the tag of your element and passing a ES6 class to handle that tag. The class always extends `HTMLElement` or another class that has `HTMLElement` in its ancestor chain.
2. In the constructor of that class, call `super()` which calls the HTMLElement constructor.

Now things get kind of optional. If you just want to attach some JavaScript to a tag, e.g. do something to the whole document or other elements, you are good with the constructor and whatever code you need. In most cases, though, you will want to have the browser show something for your new element.

Now you _can_ "just" append stuff to the element, and it will be shown. Whatever you thus attach, will become part of your parent document. Try this in codepen replace
```js
this.attachShadow({mode: 'open'}).innerHTML = 'Hello world!';
```
with
```js
this.innerHTML = 'Hello world!';
```
The result is the same! Well, superficially it is. When you do this `attachShadow` thingy, you create shadow DOM. `attachShadow` appends a `shadowRoot` element to your element. A `shadowRoot` is a "document fragment".

Your `shadowRoot` is your own private Vegas, do whatever you like without fear of breaking other stuff in the HTML page. What happens in `shadowRoot` stays in `shadowRoot`.

Vice versa whatever happens in the parent document - or parent document fragment if your element is part of another shadowRoot! - does not happen to your shadow DOM. CSS selectors don't select your stuff, code traversing the parent DOM won't come across your shadow DOM and so on. Just as the CSS in your shadow DOM does not leak out of your document fragment.

Let's try this! You removed `attachShadow` for the vanilla element above. Now replace
```js
this.innerHTML = 'Hello world!';
```
with
```js
this.innerHTML = '<style>span {color: green;}</style><span>Hello world!</span>';
```
and replace
```js
$(this).shadow('Hello world!');
```
with
```js
this.innerHTML = '<span>Hello world!</span>';
```
Both texts are green! Now, instead do
```js
this.attachShadow({mode: 'open'}).innerHTML = '<style>span {color: green;}</style><span>Hello world!</span>';
```
and
```js
$(this).shadow('<span>Hello world!</span>');
```
and only the first text is green.

ShadowQuery is just a collection of shorthand code for native technology. In this example I abbreviated the vanilla example to make it easier to read and understand. Web components usually use templates for creating their shadow DOM. `innerHTML = '...'` is pretty expensive, and when many such elements occur in a document, performance suffers. Therefor `innerHTML = '...'` is only done once in an `HTMLTemplateElement` (which has the tag `<template>`) and then this is cloned, which is much more efficient. ShadowQuery automatically does this. The full vanilla example looks like this:
```js
const template = document.createElement('template');
template.innerHTML = 'Hello world!';
window.customElements.define('vanilla-hello-world', class extends HTMLElement {
	constructor() {
   	super();
		this.attachShadow({mode: 'open'})
		.appendChild(template.content.cloneNode(true));
	}
});
```
Go ahead, try this in codepen, too!

We have covered web components basics and how ShadowQuery helps with that. [Next] we'll explore several more ShadowQuery features in another pretty simple web component.

[codepen]: https://codepen.io/schrotie/pen/rQYZae
[This]: https://github.com/schrotie/shadow-query/tree/master/demo/helloWorld
[Content]: https://github.com/schrotie/shadow-query/tree/master/demo
[Next]: https://github.com/schrotie/shadow-query/tree/master/demo/helloFramework

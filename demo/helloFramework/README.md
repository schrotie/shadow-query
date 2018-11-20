[Content] [Previous] [Next]

# Hello Framework!
In the [previous] tutorial we have learned web components basics, [here] we will explore a couple of ShadowQuery features.

Play with the "Hello Framework!" demo at [codepen].

The template of this example is a bit more complex than "Hello world!". Thus it is defined in a separate variable outside of the component. You should follow this practice in most of your components that have any significant DOM. It usually yields better readable code. JavaScript template strings, quoted by back-tics "\`" allow writing multi line strings and various editor plug-ins even do nice highlighting in these for you.

```html
	<style>
		:host {
			cursor: pointer;
			font-family: sans-serif;
		}
	</style>
	<h3><slot></slot></h3>
	<ul></ul>
```
First the style (CSS) is customized. Since `<hello-framework>` will be clickable we make the pointer indicate this fact. And since I want to give that a minimally modern appearance, the style does away with serifs. The selector of the style is `:host`. This selects/styles the `<hello-framework>` element itself, not its shadow DOM - though the shadow DOM will inherit the style, the `sans-serif` for example.

The `host` style will be overwritten by stuff in the document, the style of the shadow DOM won't. Let's try that, put this in the CSS in codepen:
```css
hello-framework {font-family: serif;}
```
Bam, that looks old! Now change the `:host` selector to `:host, *`. Yeah, you won't make me look old! To test that the somewhat radical `*` selector does not leak, you can add this to the HTML:
```html
<span>foo</span>
```
Next in the shadow DOM there is a heading `<h3>` that contains a `<slot>` and an unordered list `<ul>`. The `<slot>` says: whatever an HTML author puts inside the `<hello-framework>` tag will go here in its shadow DOM. You can thus even distribute stuff with named slots. Add this to the template _before_ the line with the `<slot>`:
```html
<h1><slot name="before"</slot></h1>
```
And then put this _after_ "Greetings!" inside `<hello-framework>` in the HTML:
```html
<span slot="before">Huh?</span>
```
All this is the web platform magic for you, no ShadowQuery, so far! But now we're getting to implementing `<hello-framework>`: the constructor does something with `$(this).on('click', ...)` - `<hello-framework>` wants to express its love for you! But you have to give it your attention first with a carassing click of your mouse. `$(this)` selects your `<hello-framework>` element in this case and the `on` method attaches an event handler, here: 'click'. Let's make `<hello-framework>` even more love-crazed: replace 'click' by 'mouseenter'.

Next we defined `connectedCallback`. Again this is a standard platform callback that gets called, when `<hello-framework>` is attached to the DOM. Actually, in this example it makes no difference from the constructor, because `<hello-framework>` is hardwired in the HTML. But when you write a component you will sometimes want to do some stuff, when you element is hooked up. Consider this code:
```js
const hello = document.createElement('hello-framework'); // constructor!
hello.setAttribute('greet', 'Angular React Vue');
document.body.appendChild(hello);                        // connectedCallback!
```
The way `<hello-framework>` is implemented, this works, too! But alas, this doesn't:
```js
const hello = document.createElement('hello-framework'); // constructor!
document.body.appendChild(hello);                        // connectedCallback!
hello.setAttribute('greet', 'Angular React Vue');
```
Let's fix this! Replace the whole `<hello-framework>` definition with this:
```js
window.customElements.define('hello-framework', class extends HTMLElement {
	constructor() {
		super();
		$(this).on('click', () => alert('ShadowQuery loves you!'));
		$(this).on('attr:greet', this._update.bind(this));
		$(this).shadow(template);
		this._update();
	}
 	_update() {
		$(this, 'ul').append({
			array   : $(this, ':host').attr('greet').split(' '),
			template: '<li> </li>',
			update  : (li, item) => li.text(`Hello ${item}!`),
		});
	}
});
```
We added a special event handler 'attr:greet', to update `<hello-framework>`, whenever the 'greet' attribute changes. When ShadowQuery sees an event beginning with "attr:" it creates an attribute mutation observer to call your callback whenever the specified attribute changes. The "attr:" prefix matches ShadowQuery's `attr` method for reading and writing attributes - we'll come to that.

ShadowQuery has two more special event handlers, one for changing properties - "prop:", matching ShadowQuery's `prop` method - and for changing text - "text:", matching the `text` method.

After creating the the shadow DOM, the constructor now calls `this._update()`. This is because in this example the attribute is already there when the constructor is called and never changes. Try it, remove the call to `this._update()`.

Finally we're getting to the `_update` method (originally `connectedCallback`). Let's first look at two different calls to ShadowQuery: `$(this, 'ul')` and `$(this, ':host')`. Each call gets two arguments, the first the initial node and the second a CSS selector to execute on the node with `querySelectorAll` (native method).

Now, ShadowQuery is called "ShadowQuery" for a reason: by default it queries your shadow DOM. That means, if a `shadowRoot` is attached to an initial node it will query that and not the host node. The host node is `<hello-framework>` in this case.

Thus ShadowQuery translates `$(this, 'ul')` to
```js
this.shadowRoot.querySelectorAll('ul')
```
However, sometimes you _do_ want the host node. When that is case, you have to pass the ':host' selector. In our example we want to get the "greet" attribute of `<hello-framework>` and we _have to_ pass the ":host" selector, because our element's shadowRoot has no attributes! Try it, remove the ":host" selector.

Note that the constructor uses a trick to circumvent this. It registers the event handlers on `<hello-framework>` _before_ the `shadowRoot` is attached. Otherwise it would need to add the ":host" selector. The "click" handler still works, when registered on the `shadowRoot`, but it works noticeably different. Try moving `$(this).shadow(template);` to before the event handler registry. Now when you click _between_ title and list, nothing happens. Revert to the original code and clicks are registered there, too.

Back to the selected `<ul>`: the `append` method is called for it. `append` like all of ShadowQuery's insertion methods can insert most reasonable stuff you throw at it: Nodes, Node-collections and -arrays, templates ... and in this case what I call a "dynamic template", i.e. a key-value object with special semantics that makes ShadowQuery do special stuff.

Dynamic templates can insert templates based on a condition and/or - as in this case - can insert arrays of templates. Here the array comes from the "greet" attribute and the template is a simple `<li>` list item element.

For every element that ShadowQuery thus creates - _or updates_! - it will call the `update` callback if you provide it. `update` is called with two arguments: first a ShadowQuery object of the rendered template content, second the element of the array to which it belongs. Actually, it passes a third element, the index, which isn't used that often, though. But replace the update method with
```js
update  : (li, item, index) => li.text(`Hello ${item}${index}!`),
```
and see what happens!

You may recall that I wrote above, that ShadowQuery uses `querySelectorAll` to evaluate selectors. That means, you can manipulate more than one element with one call. The same is true for these templates: a template can be more than one node. Replace the dynamic template with:
```js
{
	array   : $(this, ':host').attr('greet').split(' '),
	template: '<li> </li><span> </span>',
	update  : (li, item) => li.text(`Hello ${item}!`),
}
```
and see what happens. You see double! That's because `li` now is not just one list element, but a span, too! One more test, replace it again with:
```js
{
	array   : $(this, ':host').attr('greet').split(' '),
	template: '<li> </li><span></span>',
	update  : (li, item) => li.text(`Hello ${item}!`),
}
```
Gone! What happened? The only thing that changed is, that I removed the space in the `<span>`. With that I removed the text-node from the DOM, ShadowQuery can't set the nodeValue of the non-existent text node and thus the text is only added to the `<li>`.

The next time `append` is called with the dynamic template, it will update the number of nodes as required and update the existing nodes instead of re-creating everything from scratch. Let's try this, change the `$(this).append` call to
```js
$(this, 'ul').append({
	array   : ['Foo', 'Bar', 'Baz'],
	template: '<li> </li>',
	update  : (li, item) => li.text(`Hello ${item}!`),
}).append({
	array   : ['Bar', 'Foo'],
	template: '<li> </li>',
	update  : (li, item) => li.text(`Hello ${item}!`),
});
```
Now with the first call it creates everything and with the second removes a node and updates the rest.

We have covered a lot of ShadowQuery and platform features in this tutorial. In the [next] one we'll use this knowledge to build a small application.

[codepen]: https://codepen.io/schrotie/pen/aQVaaE
[Previous]: https://github.com/schrotie/shadow-query/tree/master/demo/helloWorld
[here]: https://github.com/schrotie/shadow-query/tree/master/demo/helloFramework
[Content]: https://github.com/schrotie/shadow-query/tree/master/demo
[Next]: https://github.com/schrotie/shadow-query/tree/master/demo/todo

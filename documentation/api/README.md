<a name="module_shadowQuery"></a>

## shadowQuery
ShadowQuery module.


* [shadowQuery](#module_shadowQuery)
    * [.ShadowQuery](#module_shadowQuery.ShadowQuery)
        * [new exports.ShadowQuery(node, [selector])](#new_module_shadowQuery.ShadowQuery_new)
        * [.addClass(className)](#module_shadowQuery.ShadowQuery+addClass) ⇒ <code>ShadowQuery</code>
        * [.after(nodes)](#module_shadowQuery.ShadowQuery+after) ⇒ <code>ShadowQuery</code>
        * [.append(nodes)](#module_shadowQuery.ShadowQuery+append) ⇒ <code>ShadowQuery</code>
        * [.attr(name, [value])](#module_shadowQuery.ShadowQuery+attr) ⇒ <code>ShadowQuery</code> \| <code>string</code>
        * [.before(nodes)](#module_shadowQuery.ShadowQuery+before) ⇒ <code>ShadowQuery</code>
        * [.hasClass(className)](#module_shadowQuery.ShadowQuery+hasClass) ⇒ <code>bool</code>
        * [.off(evt, callback)](#module_shadowQuery.ShadowQuery+off) ⇒ <code>ShadowQuery</code>
        * [.on(evt, noSelfOrCallback, [callback])](#module_shadowQuery.ShadowQuery+on) ⇒ <code>ShadowQuery</code>
        * [.once(evt, callback)](#module_shadowQuery.ShadowQuery+once) ⇒ <code>ShadowQuery</code>
        * [.prepend(nodes)](#module_shadowQuery.ShadowQuery+prepend) ⇒ <code>ShadowQuery</code>
        * [.prop(name, [value])](#module_shadowQuery.ShadowQuery+prop) ⇒ <code>ShadowQuery</code> \| <code>any</code>
        * [.query(selector)](#module_shadowQuery.ShadowQuery+query) ⇒ <code>ShadowQuery</code>
        * [.removeClass(className)](#module_shadowQuery.ShadowQuery+removeClass) ⇒ <code>ShadowQuery</code>
        * [.shadow([template], [options])](#module_shadowQuery.ShadowQuery+shadow) ⇒ <code>ShadowQuery</code>
        * [.text([t])](#module_shadowQuery.ShadowQuery+text) ⇒ <code>ShadowQuery</code> \| <code>string</code>
        * [.toggleClass(className, [state])](#module_shadowQuery.ShadowQuery+toggleClass) ⇒ <code>ShadowQuery</code>
    * [.shadowQuery(node, [selector])](#module_shadowQuery.shadowQuery) ⇒ <code>ShadowQuery</code>
    * [.template(template)](#module_shadowQuery.template) ⇒ <code>DocumentFragment</code> \| <code>dynTemplate</code>

<a name="module_shadowQuery.ShadowQuery"></a>

### shadowQuery.ShadowQuery
ShadowQuery Class. It extends Array, the elements being the nodes
selected or passed on initialization.
It is exported so that you can extend it or manipulate the prototype
or do whatever you like to it.

**Kind**: static class of [<code>shadowQuery</code>](#module_shadowQuery)  

* [.ShadowQuery](#module_shadowQuery.ShadowQuery)
    * [new exports.ShadowQuery(node, [selector])](#new_module_shadowQuery.ShadowQuery_new)
    * [.addClass(className)](#module_shadowQuery.ShadowQuery+addClass) ⇒ <code>ShadowQuery</code>
    * [.after(nodes)](#module_shadowQuery.ShadowQuery+after) ⇒ <code>ShadowQuery</code>
    * [.append(nodes)](#module_shadowQuery.ShadowQuery+append) ⇒ <code>ShadowQuery</code>
    * [.attr(name, [value])](#module_shadowQuery.ShadowQuery+attr) ⇒ <code>ShadowQuery</code> \| <code>string</code>
    * [.before(nodes)](#module_shadowQuery.ShadowQuery+before) ⇒ <code>ShadowQuery</code>
    * [.hasClass(className)](#module_shadowQuery.ShadowQuery+hasClass) ⇒ <code>bool</code>
    * [.off(evt, callback)](#module_shadowQuery.ShadowQuery+off) ⇒ <code>ShadowQuery</code>
    * [.on(evt, noSelfOrCallback, [callback])](#module_shadowQuery.ShadowQuery+on) ⇒ <code>ShadowQuery</code>
    * [.once(evt, callback)](#module_shadowQuery.ShadowQuery+once) ⇒ <code>ShadowQuery</code>
    * [.prepend(nodes)](#module_shadowQuery.ShadowQuery+prepend) ⇒ <code>ShadowQuery</code>
    * [.prop(name, [value])](#module_shadowQuery.ShadowQuery+prop) ⇒ <code>ShadowQuery</code> \| <code>any</code>
    * [.query(selector)](#module_shadowQuery.ShadowQuery+query) ⇒ <code>ShadowQuery</code>
    * [.removeClass(className)](#module_shadowQuery.ShadowQuery+removeClass) ⇒ <code>ShadowQuery</code>
    * [.shadow([template], [options])](#module_shadowQuery.ShadowQuery+shadow) ⇒ <code>ShadowQuery</code>
    * [.text([t])](#module_shadowQuery.ShadowQuery+text) ⇒ <code>ShadowQuery</code> \| <code>string</code>
    * [.toggleClass(className, [state])](#module_shadowQuery.ShadowQuery+toggleClass) ⇒ <code>ShadowQuery</code>

<a name="new_module_shadowQuery.ShadowQuery_new"></a>

#### new exports.ShadowQuery(node, [selector])
Instantiate a ShadowQuery object.
Will create an Array (ShadowQuery is an Array!) of nodes from node
parameter.
If selector is passed, will query all nodes passed as node and the
node-array will be the concatenated result of the queries.
Note that for the node parameter, it selects node.shadowRoot by default,
if available. If you want the node and not its shadowRoot, pass ':host'
as selector.


| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> \| <code>Array.&lt;Node&gt;</code> \| <code>NodeList</code> \| <code>ShadowQuery</code> \| <code>String</code> | the initial node(s) |
| [selector] | <code>String</code> | if passed will query node(s) with selector |

<a name="module_shadowQuery.ShadowQuery+addClass"></a>

#### shadowQuery.addClass(className) ⇒ <code>ShadowQuery</code>
add a CSS-class to all selected nodes; uses classList.add

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining calls  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | the class to add |

<a name="module_shadowQuery.ShadowQuery+after"></a>

#### shadowQuery.after(nodes) ⇒ <code>ShadowQuery</code>
Insert DOM after all selected nodes

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining calls  

| Param | Type | Description |
| --- | --- | --- |
| nodes | <code>Node</code> \| <code>Array.&lt;Node&gt;</code> \| <code>ShadowQuery</code> \| <code>String</code> \| <code>$.template</code> | DOM to insert; String will be transformed by calling $.template $.template is the result of a call to [$.template](#module_shadowQuery.template) |

<a name="module_shadowQuery.ShadowQuery+append"></a>

#### shadowQuery.append(nodes) ⇒ <code>ShadowQuery</code>
Append DOM to all selected nodes

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining calls  

| Param | Type | Description |
| --- | --- | --- |
| nodes | <code>Node</code> \| <code>Array.&lt;Node&gt;</code> \| <code>ShadowQuery</code> \| <code>String</code> \| <code>$.template</code> | DOM to insert; String will be transformed by calling $.template $.template is the result of a call to [$.template](#module_shadowQuery.template) |

<a name="module_shadowQuery.ShadowQuery+attr"></a>

#### shadowQuery.attr(name, [value]) ⇒ <code>ShadowQuery</code> \| <code>string</code>
get or set attribute values. If called with one parameters, will return
the respective attribute value of the first selected element. If called
with two parameters, will set the respective attribute for all selected
elements and return this for chaining.

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> \| <code>string</code> - this for chaining or attribute value  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | attribute name |
| [value] | <code>string</code> | value to set for attribute[name] on all elements; if undefined or false will call removeAttribute! |

**Example**  
```js
document.registerElement('hello-world', class extends HTMLElement {
	constructor() {super();}
	connectedCallback() {
		console.log($(this, ':host').attr('hello')); // -> “world?”
		$(this, ':host').attr('hello', 'world!');
		console.log($(this, ':host').attr('hello')); // -> “world!”
	}
});
<hello-world hello="world?"></hello-world>
```
<a name="module_shadowQuery.ShadowQuery+before"></a>

#### shadowQuery.before(nodes) ⇒ <code>ShadowQuery</code>
Insert DOM before all selected nodes

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining calls  

| Param | Type | Description |
| --- | --- | --- |
| nodes | <code>Node</code> \| <code>Array.&lt;Node&gt;</code> \| <code>ShadowQuery</code> \| <code>String</code> \| <code>$.template</code> | DOM to insert; String will be transformed by calling $.template $.template is the result of a call to [$.template](#module_shadowQuery.template) |

<a name="module_shadowQuery.ShadowQuery+hasClass"></a>

#### shadowQuery.hasClass(className) ⇒ <code>bool</code>
check if a selected element has the designated CSS-class ;
uses classList.contains

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>bool</code> - true if found, else undefined  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | the class to check |

<a name="module_shadowQuery.ShadowQuery+off"></a>

#### shadowQuery.off(evt, callback) ⇒ <code>ShadowQuery</code>
unregister an event handler on all selected nodes; support attribute
value, property- and text change events (see
[ShadowQuery.on](#module_shadowQuery.ShadowQuery+on));

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>String</code> | event name to pass to removeEventListener. To stop listening to attribute changes do `attr:name`, for properties `prop:name`, for text use `text:` |
| callback | <code>function</code> | function to unregister |

<a name="module_shadowQuery.ShadowQuery+on"></a>

#### shadowQuery.on(evt, noSelfOrCallback, [callback]) ⇒ <code>ShadowQuery</code>
register an event handler on all selected nodes

This is a very powerful utility: you can register standard event handlers.
In this case it's just a shorthand for

```js
node.addEventListener(evt, callback)
```

However, you can thus also manage attribute-, property- and text event
handlers. Attribute and text event handlers are implemented as
MutationObservers. Property event handlers add getter and setter
methods to the object instance. It is done on the instance and not on the
prototype in order to less likely interfere with getters and setters
implemented in the class. ShadowQuery should - but currently doesn't -
handle those. I recommend not using property event handlers on components
that you do not own yourself. Properties are the most efficient way of
data binding, but they don't support it well. Attribute- and text event
handlers are no problem and should be the preferred way of interacting
with third party components. If an independent or third party component
does use properties to interact with its surrounding - which is perfectly
reasonable - it _should_ emit standart events in order notify client code
of changes.

Another peculiarity with property event handlers:
When your web component has custom properties, it will usually want to
react to changes of the properties. To this end you implement setter
methods. Now it can happen that something instantiates your element and
sets a property _before_ your element is registered. In these cases the
property will be written as an instance property _over_ the setter method
(which comes later!). This is a trivial problem but easy to miss and
somewhat tedious to work around. If you use `$(this).on('myProperty')`,
ShadowQuery will take care of this for you. However: don't implement
getters and/or setters for you properties, ShadowQuery will do that!
Just register your event handlers with it!

Quite often an event handler changes something and directly or indirectly
triggers the event, that it handles. The noSelf option helps break this
recursion. noSelf works with all types of event handlers.

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>String</code> | event name to pass to addEventListener. To listen to attribute changes do 'attr:name'. This will create a MutationObserver for changes of the attribute called 'name'. For properties `prop:name`, for text use `text:` |
| noSelfOrCallback | <code>String</code> \| <code>function</code> | if you want to catch recursive events pass 'noSelf', otherwise put callback here |
| [callback] | <code>function</code> | function to call on event |

**Example**  
```js
$(this, 'button').on(
	'click',
	this._onButtonClick.bind(this)
);
$(this, 'button').on(
	'click',
	'noSelf',
	this._onButtonClick.bind(this)
);
$(this, ':host').on(
	'attr:hello',
	this._onHelloAtributeChange.bind(this)
);
$(this, ':host').on(
	'prop:hello',
	this._onHelloPropertyChange.bind(this)
);
$(this, 'label').on(
	'text:',
	this._onLabelTextChange.bind(this)
);
```
<a name="module_shadowQuery.ShadowQuery+once"></a>

#### shadowQuery.once(evt, callback) ⇒ <code>ShadowQuery</code>
register an event handler on all selected nodes; support attribute
value, property- and text change events (see
[ShadowQuery.on](#module_shadowQuery.ShadowQuery+on));
callback will be called at most once; Note:
this is called "one" in jQuery. For _once_ I deviate from jQuery since
the name is IMHO a bad choice. Instead I use the better name established
in node.js

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>String</code> | event name to pass to addEventListener. To listen to attribute changes do 'attr:name'. This will create a MutationObserver for changes of the attribute called 'name'. For properties `prop:name`, for text use `text:` |
| callback | <code>function</code> | function to call on event |

<a name="module_shadowQuery.ShadowQuery+prepend"></a>

#### shadowQuery.prepend(nodes) ⇒ <code>ShadowQuery</code>
Insert DOM as first content of all selected nodes

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining calls  

| Param | Type | Description |
| --- | --- | --- |
| nodes | <code>Node</code> \| <code>Array.&lt;Node&gt;</code> \| <code>ShadowQuery</code> \| <code>String</code> \| <code>$.template</code> | DOM to insert; String will be transformed by calling $.template getTemplate is the result of a call to this.getTemplate (see [$.template](#module_shadowQuery.template)) |

<a name="module_shadowQuery.ShadowQuery+prop"></a>

#### shadowQuery.prop(name, [value]) ⇒ <code>ShadowQuery</code> \| <code>any</code>
get or set property values. If called with one parameters, will return
the respective property value of the first selected element. If called
with two parameters, will set the respective property for all selected
elements and return this for chaining.

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> \| <code>any</code> - this for chaining or property value  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | property name |
| [value] | <code>string</code> | value to set for node[name] on all elements |

**Example**  
```js
document.registerElement('hello-world', class extends HTMLElement {
	constructor() {
		super();
		this.hello = 'world?'
	}
	connectedCallback() {
		console.log($(this, ':host').prop('hello')); // -> “world?”
		$(this, ':host').prop('hello', 'world!');
		console.log($(this, ':host').prop('hello')); // -> “world!”
	}
});
```
<a name="module_shadowQuery.ShadowQuery+query"></a>

#### shadowQuery.query(selector) ⇒ <code>ShadowQuery</code>
calls querySelector on all selected nodes and return new ShadowQuery
with the concatenated result. Note that this is analogous to jQuery's
find method. But since ShadowQuery is an Array, this would overwrite
Array.find. Thus I renamed the method to 'query.

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - new ShadowQuery object with the query-result  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>String</code> | CSS-selector to query |

<a name="module_shadowQuery.ShadowQuery+removeClass"></a>

#### shadowQuery.removeClass(className) ⇒ <code>ShadowQuery</code>
remove a CSS-class from all selected nodes; uses classList.remove

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining calls  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | the class to remove |

<a name="module_shadowQuery.ShadowQuery+shadow"></a>

#### shadowQuery.shadow([template], [options]) ⇒ <code>ShadowQuery</code>
`$(this).shadow(template)` is just a shorthand for
```js
this.attachShadow(options).appendChild(template)
```
You will likely do something like this in the majority of your web
component's connectedCallbacks.

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining  

| Param | Type | Description |
| --- | --- | --- |
| [template] | <code>String</code> | passed to [$.template](#module_shadowQuery.template) |
| [options] | <code>Object</code> | passed to attachShadow |

**Example**  
```js
connectedCallback() {$(this).shadow('Hello world!');}
```
<a name="module_shadowQuery.ShadowQuery+text"></a>

#### shadowQuery.text([t]) ⇒ <code>ShadowQuery</code> \| <code>string</code>
get or set textNode values. If called without parameters, will return
the respective textNode value of the first selected element. If called
with one parameters, will set the respective textNode value for all
selected elements and return this for chaining.

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> \| <code>string</code> - this for chaining or text value  

| Param | Type | Description |
| --- | --- | --- |
| [t] | <code>String</code> | string to set on nodeValue |

**Example**  
```js
document.registerElement('hello-world', class extends HTMLElement {
	constructor() {super();}
	connectedCallback() {
		console.log($(this, ':host').text()); // -> “Hello world?”
		$(this, ':host').text('Hello world!');
		console.log($(this, ':host').text()); // -> “Hello world!”
	}
});
<hello-world>Hello world?></hello-world>
```
<a name="module_shadowQuery.ShadowQuery+toggleClass"></a>

#### shadowQuery.toggleClass(className, [state]) ⇒ <code>ShadowQuery</code>
toggle a CSS-class on all selected nodes; uses classList.toggle

**Kind**: instance method of [<code>ShadowQuery</code>](#module_shadowQuery.ShadowQuery)  
**Returns**: <code>ShadowQuery</code> - this for chaining calls  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | the class to toggle |
| [state] | <code>bool</code> | if true [addClass](#module_shadowQuery.ShadowQuery+addClass), if false [removeClass](#module_shadowQuery.ShadowQuery+removeClass) |

<a name="module_shadowQuery.shadowQuery"></a>

### shadowQuery.shadowQuery(node, [selector]) ⇒ <code>ShadowQuery</code>
Instantiate a ShadowQuery object. See [ShadowQuery](#module_shadowQuery.ShadowQuery)

**Kind**: static method of [<code>shadowQuery</code>](#module_shadowQuery)  
**Returns**: <code>ShadowQuery</code> - instance  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> \| <code>Array.&lt;Node&gt;</code> \| <code>NodeList</code> \| <code>ShadowQuery</code> | the initial node |
| [selector] | <code>String</code> | if passed will query node(s) with selector |

<a name="module_shadowQuery.template"></a>

### shadowQuery.template(template) ⇒ <code>DocumentFragment</code> \| <code>dynTemplate</code>
`$.template` creates an HTMLTemplateElement, initializes it with the passed
template string, stores it in its template library, and returns a clone
of the content. On subsequent calls, the existing template is efficiently
cloned.

Instead of template string you can also pass an object in order to generate
a dynamic template.
Dynamic templates can render arrays and render conditionally. Using
dynamic templates together with the ShadowQuery DOM helper insertion
functions like `append` allows you to easily manage nodes based on dynamic
conditions. Note that when a condition changes to false or an array shrinks,
ShadowQuery DOM helper _insertion_ methods will actually _remove_ content
instead of _insert_ it. See parameter description for details.

**Kind**: static method of [<code>shadowQuery</code>](#module_shadowQuery)  
**Returns**: <code>DocumentFragment</code> \| <code>dynTemplate</code> - cloned from the created
template, or the processor of a DynTemplate if passed an object for a
dynamic template.  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>String</code> \| <code>Object</code> | the template string, use Object to define dynamic template |
| [template.array] | <code>Array</code> | array or function that returns an Array of items to render. If you don't want to use `template.update` you could also just return `{length: 5}` to render 5 nodes; if you just want conditional, you can also skip this; if you want to use the `update` callback with a conditional, you may pass `[item]` so that update gets that item |
| [template.chunks] | <code>Number</code> | if passed renders `chunks` elements and then calls `setTimeout` before continuing |
| [template.condition] | <code>Bool</code> | if false will render nothing |
| [template.done] | <code>function</code> | called when finished; optionally use together with `template.chunks`; `template.done` will never be called, if another dyn-template is rendered before this finished |
| template.template | <code>String</code> | template string for the rendered content |
| [template.update] | <code>function</code> | called for each element of the array with two parameters: `template.update(renderedContent, template.array[i])` Note that update may be called asynchronously when using `template.chunks` |
| [template.id] | <code>String</code> | key to identify rendered content; only required if you want multiple dynTemplates under the same parent |

**Example**  
```js
connectedCallback() {
	$(this).shadow('<ul></ul>');
	$(this, 'ul').append({
		array: () => $(this, ':host').attr('greet').split(),
		template: '<li></li>',
	});
}
```

[Content] [Previous] [Next]

# TODO List Application
In the [previous] tutorial we have explored a couple of ShadowQuery features. Here we will learn how to stitch that together to a small application of components that work together.

Play with the "TODO list" demo at [codepen].

The application is a TODO list. It allows you to add TODOs to the list, mark them as done and filter the list to show either all TODO items, or the active ones, or the completed ones. At the top there is an input and button for adding items, the middle is taken by the TODO list and the bottom contains three buttons for filtering the list as desired.

We'll go through the application in that order - from top to bottom, starting with main application component `<sq-todo>` that brings everything together. Thus we first get the high level view of the application and then drill into the details from top to bottom.

The template of `<sq-todo>` should contain no surprises for you, if you did the previous tutorials. It's a bit of styling and then the parts of the application in the order discusses above:
```html
<sq-todo-add></sq-todo-add>
<sq-todo-list></sq-todo-list>
<sq-todo-filter></sq-todo-filter>
```
`<sq-todo>`'s constructor first instantiates its shadow DOM and then pulls off a new ShadowQuery trick that we haven't seen, yet:
```js
[this._add, this._list, this._filter] = $(this, 'style ~ *').map(el => $(el));
```
First, if you haven't seen such, this is desctructuring assignment, an ES6 feature:
```js
const [a, b] = [1, 2];
console.log(a); // -> 1
```
Here we have an array of `this._*` on the left. This creates a couple of instance variables, that allows `<sq-todo>` simpler access to its DOM further down in the code. You may frequently like to do something like this, especially in performance critical code. Thus you do the ShadowQuery objects initialization only once, instead of each time you need access.

On the right we have a ShadowQuery object. ShadowQuery inherits from Array, so any ShadowQuery object _is_ an array! This one selects all of the elements in the shadow DOM after the style, i.e. the three top-level nodes we saw in the template above. Then it calls Array's `map` method to make another ShadowQuery object of each selected element, and finally assigns the result to `<sq-todo>`'s instance properties.

Next it creates one array with the `initialTodos`. In a real application this would likely be empty, but for the tutorial it's nicer to have some dummies there from the start. `initialTodos` will never be overwritten, it is apart from the filter setting the complete, persistent application state. Various components will change it and thus communicate.

This is a typical architecture with two way binding - and I don't recommend it as your architecture backbone! This approach _can_ make things a lot easier in very simple settings - and our TODO app is very simple. It can also be used inside slightly complex components to do their thing. But for any non-tiny application you should choose a more elaborate architecture as discussed in the [next] tutorial.

If you happen to have experience with designing C/C++ (or similar, can also be done in JavaScript) programs: this two-way binding approach in UI is somewhat similar to declaring a global variable and having different parts of the program communicate over that - _bad_ idea. The scope of two way bindings can be limited, that's better. And so it is okay to use in very limited scopes, but don't have your whole program be a network of two-way bindings!

With this line
```js
$(this, 'sq-todo-add, sq-todo-list').prop('todo', initialTodos);
```
`<sq-todo>` selects its `<sq-todo-add>` and `<sq-todo-list>` children and sets the `todo` property of each to `initialTodos`. Thus the application state is given to the components that deal with it. It is kept persistently in these `todo` properties. For the exchange of somewhat complex information you should usually use properties, not attributes. Attributes are great for many purposes, but JSON encoding/-decoding is not one of them.

Now, when `<sq-todo-add>` adds a TODO, `<sq-todo-list>` must show it. Thus `<sq-todo>` listens to `<sq-todo-add>`'s "add" event and tells `<sq-todo-list>` to update when that happens:
```js
this._add.on('add', () => $(this, 'sq-todo-list')[0].update());
```
Again, this is okayish for this tiny example. For more complex cases or for more re-usability you may consider using a change detection library or use ECMA Script 6 proxy objects to generate callbacks on changes.

Finally `<sq-todo>` listens to changes of `<sq-todo-filter>`'s "data-filter" attribute and propagates these to `<sq-todo-list>`'s "filter" property:
```js
this._filter.on('attr:data-filter', () =>
	this._list.prop('filter', this._filter.attr('data-filter'))
);
```
This gives us a binding from an attribute to a property. You can thus create bindings between any combination of attributes, properties, texts. Note that the attribute name has a "data-" prefix. This is according to the W3C's HTML 5 specification. Angular decided right from the start to not give a shit about this specification and mis-educated everybody on custom attributes. I recommend to heed the spec. and prefix your custom attributes with "data-".

This concludes the wiring of our TODO application, one component covered, four to go. But the going gets easier from here, since we covered the whole application architecture with `<sq-todo>`. Next is the component for adding TODOs. In its constructor it creates its shadow DOM and hooks up event listeners for when return is hit in the `<input>` or when the "Add" button is clicked:
```js
$(this, 'input').on('keyup', evt => (evt.keyCode === 13) && this._add());
$(this, 'button').on('click', this._add.bind(this));
```
In both cases the `_add` method is called which checks if a non-duplicate value is in the `<input>`
```js
const value = $(this, 'input').prop('value');
if(!value || (this.todo.indexOf(value) !== -1)) return;
```
and if that is case, adds the TODO to the list, tells the world and resets its `<input>`:
```js
this.todo.push({value});
this.dispatchEvent(new CustomEvent('add', {bubbles: true}));
$(this, 'input').prop('value', '');
```
Easy right? Getting easier! The next component in line is the `<sq-todo-list>`. We have basically covered everything it does in our [previous] tutorial on `<hello-framework>`. Please review `<sq-todo-list>`'s implementation and refer to the `<hello-framework>` tutorial if you unsure about anything. There is one more binding here, though, setting the "todo" property of the individual `<sq-todo-item>`s:
```js
_updateItem(node, todo) {
	$(node[0].firstChild, ':host').prop('todo', todo);
}
```
Which brings us to `<sq-todo-item>`. We have already covered most of what it does, but let's have a brief look at its `_update` method:
```js
$(this, 'label').text(this.todo && this.todo.value)
.toggleClass('done', this.todo && this.todo.done);
```
When the element's `todo` property changes, the string of the label will be updated and the label's "done" class will be toggled depending on the TODO item's status. This uses chaining of calls, which is supported by all of ShadowQuery's methods - they return this, so that you can call several methods on one query.

Last not least we cover the `<sq-todo-filter>` component. Again the code should at this point hold no surprises for you. Just one note: the first line of its "click" handler sets its "data-filter" attribute with
```js
$(this, ':host').attr('data-filter', evt.composedPath()[0].id);
```
This is the other side of the attribute data binding we discussed for `<sq-todo>`. Also on this occasion please recall the discussion of the ":host" selector in the previous tutorial. Here is a good spot to test that. You can remove the selector and observe the application stopping to work :-)

That's it! Our first application is done. Now I spent quite some time explaining to you that the app architecture is terrible. Still all of ShadowQuery's features that make this easy to wire up this way are very useful in many situations. And [next] we'll explore how to morph our TODO list into a great architecture!

[codepen]: https://codepen.io/schrotie/pen/jQaeby
[Previous]: https://github.com/schrotie/shadow-query/tree/master/demo/helloFramework
[here]: https://github.com/schrotie/shadow-query/tree/master/demo/todo
[Content]: https://github.com/schrotie/shadow-query/tree/master/demo
[Next]: https://github.com/schrotie/shadow-query/tree/master/demo/todoRedux

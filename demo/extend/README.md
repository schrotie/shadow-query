[Content] [Previous]

# Extending ShadowQuery

So ShadowQuery ain't kicking it for you? Well, it ain't no old dog, let's teach it some new tricks!

Play with the "Extending ShadowQuery" demo at [codepen].

I have a problem. And you must suffer for it :-( The voices tell me to order the methods in the class alphabetically. Yet, starting with the alphabetically simpler second method didactically makes more sense. And I'm getting ahead of myself. Ugh, gosh!

First things first: if you want to extend ShadowQuery ... the ECMA Script language has a keyword "extends", so this is really straightforward: import the ShadowQuery class and extend it. Now for the second method in the demo. Cough.

jQuery had this really handy `css` method that allowed you to get computed CSS and set one or more style properties. This is not in original ShadowQuery because you _should_ usually not set inline style. Instead declare all required styles in your component style and switch classes. Now, if you need an animation, just add transition or animation to your style. Don't animate inline style with JavaScript!

However, there are cases where setting inline style makes sense, mostly having to do with absolute positioning. And anyway, who am I to tell you what to do and don't? So lets add that funky `css` method.

First look at its implementation: pass it one string and it will return the computed value of the requested style property of the first matched node. Pass it two strings and it will set the value of the requested style property for all matched nodes. Pass it one object and it will set all values of that object on the style of all matched elements. Finally, being a good ShadowQuery citizen, it returns `this` for chaining.

Now let's jump to the end of the [codepen] demo. There a `<sq-extend>` component is defined, that demonstrates the new functionality extension. The template has `<div id="a">` and `<div id="b">` to play with and a bit more stuff to display results.

The constructor initializes some accessors, a construct we have discussed in the [TODO] tutorial:
```js
[this.a, this.b] = $(this, '#a, #b').map(el => $(el));
```
Next it makes the three different calls of `css` discussed above, the result being displayed in the demo. I did not test, whether this works for multiple nodes as intended. You could do
```js
 this.ab = $(this, '#a, #b')
```
, mess with `this.ab.css` and open a bug report for ShadowQuery if it does not work as expected.

On to the first method of the ShadowQuery extension, `bind`: again this is something that looks real cool, nifty, useful, but that the grumpy old party pooper author of ShadowQuery (yeah, me) considers it too dangerous for you. 'Cause it encourages bad practice, blah, blah, blah. Fuck me, gimme that cool shit!

By the way, here is what it does: if you did the [todo] tutorial you know that that simple app uses several bindings between properties, attributes and text to wire up the app from a couple of components. `bind` makes that even easier. Actually most modern frameworks support `bind` one way or another. But you are certainly aware that such frameworks are incarnations of pure evil that only want to spoil you and your code. Rrright.

The source node(s) of a binding are the matched elements of the ShadowQuery object, the target(s) is/are passed as a parameter. On top of nodes we also need to know _what exactly_ to bind. For this the `bind` method uses the same syntax as ShadowQuery's event handling, i.e. "attr:data-attribute-name", "prop:propertyName", or just "text:". Thus we have source node(s), target node(s) and binding specifiers ("from" and "to") for each.

Since `target` should support multiple nodes as customary in ShadowQuery, helper function `toNodes` transforms whatever the client passed as `target` into an array of nodes and `bind` iterates through each sources and targets. For each combination it creates a binding using another helper that leverages ShadowQuery's symmetry between event handlers and value accessors. Finally it creates the reverse binding if desired.

Note that it uses the "noSelf" option for event handlers. This prevents event recursion as would inevitably happen on "twoWay" bindings.

Back to the `<sq-extend>` demo at the bottom. Before the template the `$` function is defined that is used throughout the demo/test code. Usually you'll want to do something like
```js
export function myShadowQuery(...arg) {return new MyShadowQuery(...arg);}
export default myShadowQuery;
```
when you write a ShadowQuery extension.

On to the actual test code. After the `css` stuff the component uses the new bind method to display the attribute and property - that it will bind for testing - in its DOM. Then
1. it sets some values to the test elements so that you can see they are separate
2. creates a two-way binding
3. with a second delay sets the attribute so you see the first binding direction
4. with another second delay sets the property so you see the reverse binding.

For value settings it doesn't use ShadowQuery for once, to make sure this works no matter how. Play around, test if works _with_ ShadowQuery value accessors, several nodes, one-way ...

That's it! I hope you enjoyed the ShadowQuery tutorials and that ShadowQuery helps you one way or another! Peace, Thorsten

[codepen]: https://codepen.io/schrotie/pen/bQLZeq?editors=1010
[Previous]: https://github.com/schrotie/shadow-query/tree/master/demo/todoRedux
[todo]: https://github.com/schrotie/shadow-query/tree/master/demo/todo
[here]: https://github.com/schrotie/shadow-query/tree/master/demo/extend
[Content]: https://github.com/schrotie/shadow-query/tree/master/demo

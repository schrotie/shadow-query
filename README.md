# shadow-query
Micro-library for writing vanilla web components

* [Introduction](https://github.com/schrotie/shadow-query/tree/master/documentation/introduction)
* [Motivation](https://github.com/schrotie/shadow-query/tree/master/documentation/motivation)
* [API reference](https://github.com/schrotie/shadow-query/tree/master/documentation/api)
* [Tutorial](https://github.com/schrotie/shadow-query/tree/master/demo)


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

# Installation
```sh
npm i -s 'shadow-query'
```

# Status

ShadowQuery is currently a proof of concept. I have developed one smallish (1.5k lines) web application on it. ShadowQuery now comes with a test suite that covers 100% of the lines of code. I would not recommend it for production, it needs more testing.

# Intended Audience

If you're the ~~Visual Basic~~ Angular/React kind of dev, ShadowQuery is not for you. It does not hold your hand, it does not structure your project. ShadowQuery is for you (or would be if it had outgrown experimental status), if you like to be in control, if you know what you're doing. It has zero magic, no surprises … actually, one thing did surprise me: you really need very little utility to empower you to write vanilly web components and make full use of the platform.

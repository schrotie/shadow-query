# Motivation

So I was writing this web app of mine, starting from vanilla web components. At some point I pulled in a templating library and in the end was unhappy with the result (custom template syntax and performance). So I started implementing my own helpers which ultimately led to ShadowQuery.

These past five years I have grown increasingly suspicious of the dynamic templating done in Angular/React/Vue and almost any modern framework. Dynamic templating has become a universal pattern of modern web development. I'm not entirely sure that this is the right way to. Templates and components I have no doubt about, at all, "just" these templates with injected JavaScript. I have laid out my thoughts in more detail [here](https://blog.roggendorf.pro/2018/11/15/web-platform-to-the-rescue/).

But dynamic templates are so damn convenient. I had to find out what's necessary to work without them. Turns out: a puny 350 lines of generic helper code, that's mostly straightforward shorthand for things already on the platform plus a bit of array and conditional templating. And this tiny bit of code did not just keep me barely afloat: Components written with it are concise, expressive and very readable and maintainable and - if done right - leave any framework-developed app yelping in the dust with regards to footprint an performance. Most importantly: any web developer with some worthwhile experience of working with actual DOM and Javascript can tell immediately what's going on.

So that is ShadowQuery: A showcase and plea for another approach to web development. It's so tiny that there's little hurdle to using it. Costs next to nothing footprint-wise and if it breaks on you, you can easily fix it, 'cause it's just 350 lines. If you think the approach sounds interesting but don't like ShadowQuerie's syntax: great! Write your own, it's surprisingly simple.

Maybe it will eventually grow to to 3K but I currently consider it complete (feature-wise, still needs more testing, fixing, syntax may change ...). The trick is: it covers the most common use case and simplifies DOM access for anything else. I won't for example implement inline style manipulation, because I consider it bad practice. But doing
```js
$(this, 'a').forEach(a => a.style.textDecoration = 'none');
// or:
$(this, '#myLink')[0].style.textDecoration = 'none';
```
is still simple, and if you want, it's easy to `import {ShadowQuery} from '...'` and extend it to support
```js
$(this, 'a').css({textDecoration:'none'});
```
Indeed the [extending](https://github.com/schrotie/shadow-query/tree/master/demo/extend) ShadowQuery tutorial features this exact example.

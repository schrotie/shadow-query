import $ from '../shadowQuery.js';
import './testComponent.js';

chai.should();

const dom = `\
<span id="span"></span>\
<button id="button"></button>\
<div id="div">\
<label id="label"></label>\
<label           ></label>\
</div>\
<h1 id="h1-1"></h1>\
<h1 id="h1-2"></h1>\
<p id="p"><label id="label-2"/></p>\
<test-component id="wc"></test-component>\
`;

const body = id('test');

function id(id) {return document.getElementById(id);}

describe('new ShadowQuery', () => {
	before(() => body.innerHTML = dom);
	it('initializes from node', () => {
		$(id('div')                   )[0].should.equal(id('div'));
	}); it('initializes from node array', () => {
		$([id('div'), id('h1-1')]     )[0].should.equal(id('div'));
		$([id('div'), id('h1-1')]     )[1].should.equal(id('h1-1'));
	}); it('initializes from NodeList', () => {
		$(body.childNodes             )[0].should.equal(id('span'));
		$(body.childNodes             )[2].should.equal(id('div'));
	}); it('initializes from HTMLCollection', () => {
		$(body.children               )[0].should.equal(id('span'));
		$(body.children               )[2].should.equal(id('div'));
	}); it('excecutes basic selectors', () => {
		$(body, 'span'                )[0].should.equal(id('span'  ));
		$(body, 'button'              )[0].should.equal(id('button'));
		$(body, 'div > label'         )[0].should.equal(id('label' ));
		$(body, 'h1'                  )[0].should.equal(id('h1-1'  ));
		$(body, 'h1'                  )[1].should.equal(id('h1-2'  ));
		$(body, 'h1'                  )[1].should.equal(id('h1-2'));
	}); it('excecutes chained selectors', () => {
		$(body, 'div'  ).query('label')[0].should.equal(id('label'));
	}); it('excecutes chained selectors for several nodes', () => {
		$(body, 'div,p').query('label')[0].should.equal(id('label'));
		$(body, 'div,p').query('label')[2].should.equal(id('label-2'));
	}); it('selects shadowRoot by default', () => {
		$(id('wc')                    )[0].should.equal(id('wc').shadowRoot);
	}); it('selects host with :host selector', () => {
		$(id('wc'), ':host'           )[0].should.equal(id('wc'));
	}); it('selects host in queries', () => {
		$(body, 'test-component'      )[0].should.equal(id('wc'));
	});
});

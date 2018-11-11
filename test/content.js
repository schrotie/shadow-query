import $ from '../shadowQuery.js';

const dom = `\
<span id="foo" data-test="foo">foo</span>\
<span id="bar" data-test="bar">bar</span>\
`;

function ini() {
	test().innerHTML = dom;
	foo().testProp = 'foo';
	bar().testProp = 'bar';
}
function foo() {return document.getElementById('foo');}
function bar() {return document.getElementById('bar');}
function test() {return document.getElementById('test');}

describe('content', () => {
	beforeEach(ini);

	it('reads first text', () => {
		foo().childNodes[0].nodeValue.should.equal('foo');
		$(test(), 'span').text().should.equal('foo');
	});

	it('sets text', () => {
		$(foo()).text('baz');
		foo().childNodes[0].nodeValue.should.equal('baz');
	});

	it('sets multiple texts', () => {
		$(test(), 'span').text('baz');
		foo().childNodes[0].nodeValue.should.equal('baz');
		bar().childNodes[0].nodeValue.should.equal('baz');
	});


	it('reads first attribute', () => {
		foo().getAttribute('data-test').should.equal('foo');
		$(test(), 'span').attr('data-test').should.equal('foo');
	});

	it('sets attribute', () => {
		$(foo()).attr('data-test', 'baz');
		foo().getAttribute('data-test').should.equal('baz');
	});

	it('sets multiple attributes', () => {
		$(test(), 'span').attr('data-test', 'baz');
		foo().getAttribute('data-test').should.equal('baz');
		bar().getAttribute('data-test').should.equal('baz');
	});

	it('removes attribute', () => {
		$(foo()).attr('data-test', false);
		foo().hasAttribute('data-test').should.equal(false);
		$(bar()).attr('data-test', undefined);
		bar().hasAttribute('data-test').should.equal(false);
	});

	it('removes multiple attributes', () => {
		$(test(), 'span').attr('data-test', false);
		foo().hasAttribute('data-test').should.equal(false);
		bar().hasAttribute('data-test').should.equal(false);
	});


	it('reads first property', () => {
		foo().testProp.should.equal('foo');
		$(test(), 'span').prop('testProp').should.equal('foo');
	});

	it('sets property', () => {
		$(foo()).prop('testProp', 'baz');
		foo().testProp.should.equal('baz');
	});

	it('sets multiple properties', () => {
		$(test(), 'span').prop('testProp', 'baz');
		foo().testProp.should.equal('baz');
		bar().testProp.should.equal('baz');
	});

	it('removes property', () => {
		$(foo()).prop('testProp', false);
		foo().hasOwnProperty('testProp').should.equal(false);
		$(bar()).prop('testProp', undefined);
		bar().hasOwnProperty('testProp').should.equal(false);
	});

	it('removes multiple property', () => {
		$(test(), 'span').prop('testProp', false);
		foo().hasOwnProperty('testProp').should.equal(false);
		bar().hasOwnProperty('testProp').should.equal(false);
	});
});

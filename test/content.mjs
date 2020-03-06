import $ from '../shadowQuery.mjs';

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

	it('reads texts with §', () => {
		foo().childNodes[0].nodeValue.should.equal('foo');
		$(test(), 'span').access('§').should.deep.equal(['foo', 'bar']);
	});

	it('sets text', () => {
		$(foo()).text('baz');
		foo().childNodes[0].nodeValue.should.equal('baz');
	});

	it('sets text with §', () => {
		$(foo()).access('§', 'baz');
		foo().childNodes[0].nodeValue.should.equal('baz');
	});

	it('sets multiple texts', () => {
		$(test(), 'span').text('baz');
		foo().childNodes[0].nodeValue.should.equal('baz');
		bar().childNodes[0].nodeValue.should.equal('baz');
	});

	it('sets text on empty element', () => {
		test().innerHTML = '<span></span>';
		$(test(), 'span').text('foo');
		test().childNodes[0].childNodes[0].nodeValue.should.equal('foo');
	});


	it('reads first attribute', () => {
		foo().getAttribute('data-test').should.equal('foo');
		$(test(), 'span').attr('data-test').should.equal('foo');
	});

	it('reads attributes with @', () => {
		foo().getAttribute('data-test').should.equal('foo');
		$(test(), 'span').access('@data-test').should.deep.equal(['foo', 'bar']);
	});

	it('sets attribute', () => {
		$(foo()).attr('data-test', 'baz');
		foo().getAttribute('data-test').should.equal('baz');
	});

	it('sets attribute with @', () => {
		$(foo()).access('@data-test', 'baz');
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

	it('reads properties with .', () => {
		foo().testProp.should.equal('foo');
		$(test(), 'span').access('.testProp').should.deep.equal(['foo', 'bar']);
	});

	it('sets property', () => {
		$(foo()).prop('testProp', 'baz');
		foo().testProp.should.equal('baz');
	});

	it('sets property with .', () => {
		$(foo()).access('.testProp', 'baz');
		foo().testProp.should.equal('baz');
	});

	it('sets multiple properties', () => {
		$(test(), 'span').prop('testProp', 'baz');
		foo().testProp.should.equal('baz');
		bar().testProp.should.equal('baz');
	});

	it('fails on invalid access call', () => {
		const f = () => $(foo()).access('testProp', 'baz');
		f.should.throw(Error);
	});

	it('calls a method with arguments', () => {
		$(test(), 'span').call('matches', 'span').should.deep.equal([true, true]);
		$(test(), 'span').ccall('remove').access('.nodeName')
			.should.deep.equal(['SPAN', 'SPAN']);
		$(test(), 'span').length.should.equal(0);
	});
});

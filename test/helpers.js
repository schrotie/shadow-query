import $ from '../shadowQuery.js';

const dom = `<span id="span"></span>`;

function ini() {document.getElementById('test').innerHTML = dom;}
function node() {return document.getElementById('span');}
function change(obj, atomic) {return {test:{obj:{foo:obj}, atomic}};}
function evt() {node().dispatchEvent(new CustomEvent('test-event'));}

describe('helpers', () => {
	beforeEach(ini);

	it('correctly detect change', () => {
		const node = {};
		$.changed(node, change('foo', 'foo')).should.equal(true);
		$.changed(node, change('foo', 'foo')).should.equal(false);
		$.changed(node, change('bar', 'bar')).should.equal(true);
		$.changed(node, change('foo', 'bar')).should.equal(true);
		$.changed(node, change('foo', 'foo')).should.equal(true);
		$.changed(node, change('foo', 'foo')).should.equal(false);
	});

	it('prevent recursive events', done => {
		node().addEventListener('test-event', $.noSelf(() => {
			done();
			evt();
		}));
		evt();
	});

	it('attach shadow root with content', () => {
		$.shadow(node(), `<span data-test="foo"></span>`);
		const shadow = node().shadowRoot;
		const span = shadow && shadow.firstChild;
		(shadow !== undefined).should.equal(true);
		(span   !== undefined).should.equal(true);
		span.getAttribute('data-test').should.equal('foo');
	});
});

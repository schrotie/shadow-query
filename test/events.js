
import $ from '../shadowQuery.js';

const dom = `\
<span id="foo" data-test="foo">foo</span>\
<span id="bar" data-test="bar">bar</span>\
`;

function ini()  {test().innerHTML = dom;}
function test() {return document.getElementById('test');}
function foo()  {return document.getElementById('foo');}
function evt()  {foo().dispatchEvent(new CustomEvent('test-event'));}
function attr() {foo().setAttribute('data-test', 'baz');}
function text() {foo().childNodes[0].nodeValue = 'baz';}
function prop() {foo().testProp = 'foo';}

describe('events', () => {
	beforeEach(ini);

	it('registers an event listener', done => {
		$(foo()).on('test-event', () => done());
		evt();
	});

	it('unregisters an event listener', done => {
		$(foo()).on('test-event', done);
		const listener = () => done();
		$(foo()).on('test-event', listener);
		$(foo()).off('test-event', done);
		evt();
	});

	it('catches a recursive event listener', done => {
		$(foo()).on('test-event', 'noSelf', () => {evt(); done()});
		evt();
	});

	it('unregisters a recursive event listener', done => {
		$(foo()).on('test-event', 'noSelf', done);
		const listener = () => done();
		$(foo()).on('test-event', listener);
		$(foo()).off('test-event', done);
		evt();
	});

	it('registers several event listeners', done => {
		$(test(), 'span').on('test-event', () => done());
		evt();
	});

	it('registers a one-time event listener', done => {
		$(foo()).once('test-event', () => done());
		evt();
		evt();
	});


	it('registers an attribute listener', done => {
		$(foo()).on('attr:data-test', () => done());
		attr();
	});

	it('unregisters an attribute listener', done => {
		$(foo()).on( 'attr:data-test', done);
		$(foo()).off('attr:data-test', done);
		attr();
		done();
	});

	it('catches a recursive attribute listener', done => {
		$(foo()).on('attr:data-test', 'noSelf', () => {attr(); done()});
		attr();
	});

	it('unregisters a recursive attribute listener', done => {
		$(foo()).on( 'attr:data-test', 'noSelf', done);
		$(foo()).off('attr:data-test', done);
		attr();
		done();
	});

	it('registers several attribute listeners', done => {
		$(test(), 'span').on('attr:data-test', () => done());
		attr();
	});

	it('registers a one-time attribute listener', done => {
		$(foo()).once('attr:data-test', () => done());
		attr();
		attr();
	});


	it('registers a text listener', done => {
		$(foo()).on('text:', () => done());
		text();
	});

	it('unregisters a text listener', done => {
		$(foo()).on( 'text:', done);
		$(foo()).off('text:', done);
		text();
		done();
	});

	it('catches a recursive text listener', done => {
		$(foo()).on('text:', 'noSelf', () => {text(); done()});
		text();
	});

	it('unregisters a recursive text listener', done => {
		$(foo()).on( 'text:', 'noSelf', done);
		$(foo()).off('text:', done);
		text();
		done();
	});

	it('registers several text listeners', done => {
		$(test(), 'span').on('text:', () => done());
		text();
	});

	it('registers two text listeners on same node', done => {
		Promise.all([
			new Promise(resolve => $(foo()).on('text:', resolve)),
			new Promise(resolve => $(foo()).on('text:', resolve)),
		]).then(() => done());
		text();
	});

	it('registers a one-time text listener', done => {
		$(foo()).once('text:', () => done());
		text();
		text();
	});


	it('registers a property listener', done => {
		$(foo()).on('prop:testProp', () => done());
		prop();
	});

	it('property listeners keep preset values', done => {
		foo().testProp = 'foo';
		$(foo()).on('prop:testProp', () => done());
		foo().testProp.should.equal('foo');
		prop();
	});

	it('unregisters a property listener', done => {
		$(foo()).on( 'prop:testProp', done);
		$(foo()).off('prop:testProp', done);
		prop();
		done();
	});

	it('catches a recursive property listener', done => {
		$(foo()).on('prop:testProp', 'noSelf', () => {prop(); done()});
		prop();
	});

	it('unregisters a recursive property listener', done => {
		$(foo()).on( 'prop:testProp', 'noSelf', done);
		$(foo()).off('prop:testProp', done);
		prop();
		done();
	});

	it('registers several property listeners', done => {
		$(test(), 'span').on('prop:testProp', () => done());
		prop();
	});

	it('registers a one-time property listener', done => {
		$(foo()).once('prop:testProp', () => done());
		prop();
		prop();
	});

	it('"unregisters" none-existing events', done => {
		function dummy() {}
		$(foo()).off('attr:data-test', dummy);
		$(foo()).off('prop:testProp',  dummy);
		$(foo()).off('text:',          dummy);
		done();
	});
});

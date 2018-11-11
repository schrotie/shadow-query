import $ from '../shadowQuery.js';

const dom = `<span id="span"></span>`;

function ini() {document.getElementById('test').innerHTML = dom;}
function node() {return document.getElementById('span');}
const template = `<span data-test="foo"></span>`;
function update(node, el) {node[0].setAttribute('data-test', el);}

describe('templates', () => {
	beforeEach(ini);

	it('append a simple template', () => {
		$(node()).append($.template(template));
		const span = node().firstChild;
		(span !== undefined).should.equal(true);
		span.getAttribute('data-test').should.equal('foo');
	});

	it('don\'t append a falsy conditional template', () => {
		$(node()).append($.template({condition: false, template}));
		node().children.length.should.equal(0);
	});

	it('append a truthy conditional template', () => {
		$(node()).append($.template({condition: true, template}));
		const span = node().firstChild;
		(span !== undefined).should.equal(true);
		span.getAttribute('data-test').should.equal('foo');
	});

	it('remove a falsy conditional template', () => {
		$(node()).append($.template({condition: true, template}));
		$(node()).append($.template({condition: false, template}));
		node().children.length.should.equal(0);
	});

	it('append an array template', () => {
		const array = ['foo', 'bar', 'baz'];
		$(node()).append($.template({array, template, update}));
		const span = node().children;
		span.length.should.equal(array.length);
		for(let i = 0; i < array.length; i++) {
			span[i].getAttribute('data-test').should.equal(array[i]);
		}
	});

	it('remove obsolete array-template nodes', () => {
		let array = ['foo', 'bar', 'baz'];
		$(node()).append($.template({array, template, update}));
		array = ['foo', 'bar'];
		$(node()).append($.template({array, template, update}));
		const span = node().children;
		span.length.should.equal(array.length);
		for(let i = 0; i < array.length; i++) {
			span[i].getAttribute('data-test').should.equal(array[i]);
		}
	});

	it('append a chunked array template', done => {
		const array = ['foo', 'bar', 'baz'];
		$(node()).append($.template({array, template, update, chunks:1,
			done:finish}));
		function finish() {
			const span = node().children;
			span.length.should.equal(array.length);
			for(let i = 0; i < array.length; i++) {
				span[i].getAttribute('data-test').should.equal(array[i]);
			}
			done();
		}
	});

	it('override a chunked array template with 2nd', done => {
		let array = ['foo', 'bar', 'baz'];
		$(node()).append($.template({array, template, update, chunks:2, done}));
		array = ['foo', 'bar'];
		$(node()).append($.template({array, template, update, chunks:1,
			done:finish}));
		function finish() {
			const span = node().children;
			span.length.should.equal(array.length);
			for(let i = 0; i < array.length; i++) {
				span[i].getAttribute('data-test').should.equal(array[i]);
			}
			done();
		}
	});
});

import $ from '../shadowQuery.js';

const dom = `<span id="out"><span id="in"></span></span>`;

function ini() {document.getElementById('test').innerHTML = dom;}
function inner() {return document.getElementById('in');}
function outer() {return document.getElementById('out');}

describe('insertion', () => {
	beforeEach(ini);

	it('attaches shadow root with content', () => {
		$(inner()).shadow(`<span data-test="foo"></span>`);
		const shadow = inner().shadowRoot;
		const span = shadow && shadow.firstChild;
		(shadow !== undefined).should.equal(true);
		(span   !== undefined).should.equal(true);
		span.getAttribute('data-test').should.equal('foo');
	});

	it('appends node at end', () => {
		$(outer()).append(document.createElement('div'));
		outer().children.length.should.equal(2);
		outer().children[0].localName.should.equal('span');
		outer().children[1].localName.should.equal('div');
	});

	it('appends to several nodes', () => {
		$(inner()).append(() => document.createElement('span'));
		$(inner()).append(() => document.createElement('span'));
		inner().children.length.should.equal(2);
		$(inner(), 'span').append(() => document.createElement('div'));
		inner().children[0].children.length.should.equal(1);
		inner().children[1].children.length.should.equal(1);
	});

	it('appends HTMLCollection', () => {
		const template = document.createElement('template');
		template.innerHTML = `<p></p><p></p><p></p>`;
		$(inner()).append(template.content.cloneNode(true));
		inner().children.length.should.equal(3);
		inner().children[0].localName.should.equal('p');
	});

	it('appends Node Array', () => {
		const array = [
			document.createElement('p'),
			document.createElement('p'),
		];
		$(inner()).append(array);
		inner().children.length.should.equal(2);
		inner().children[0].localName.should.equal('p');
	});

	it('appends NodeList', () => {
		const div = document.createElement('div');
		div.appendChild(document.createElement('p'));
		div.appendChild(document.createElement('p'));
		$(inner()).append(div.childNodes);
		inner().children.length.should.equal(2);
		inner().children[0].localName.should.equal('p');
	});

	it('prepends node at beginning', () => {
		$(outer()).prepend(document.createElement('div'));
		outer().children.length.should.equal(2);
		outer().children[0].localName.should.equal('div');
		outer().children[1].localName.should.equal('span');
	});

	it('prepends node to empty node', () => {
		$(inner()).prepend(document.createElement('div'));
		inner().children.length.should.equal(1);
		inner().children[0].localName.should.equal('div');
	});

	it('inserts before', () => {
		$(outer()).append(document.createElement('div'));
		$(outer(), 'div').before(document.createElement('p'));
		outer().children.length.should.equal(3);
		outer().children[1].localName.should.equal('p');
	});

	it('inserts after', () => {
		$(outer()).append(document.createElement('div'));
		$(outer(), 'span').after(document.createElement('p'));
		outer().children.length.should.equal(3);
		outer().children[1].localName.should.equal('p');
	});

	it('inserts after last node', () => {
		$(outer(), 'span').after(document.createElement('p'));
		outer().children.length.should.equal(2);
		outer().children[1].localName.should.equal('p');
	});
});

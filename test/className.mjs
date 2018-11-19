import $ from '../shadowQuery.mjs';

const dom = `<span id="span"></span>`;

function ini() {document.getElementById('test').innerHTML = dom;}
function node() {return document.getElementById('span');}

describe('class manipulation', () => {
	beforeEach(ini);
	it('adds class', () => {
		node().className.should.equal('');
		$(node()).addClass('foo');
		node().className.should.equal('foo');
		$(node()).addClass('bar');
		node().className.should.equal('foo bar');
	});

	it('removes class', () => {
		node().className = 'foo bar';
		node().className.should.equal('foo bar');
		$(node()).removeClass('foo');
		node().className.should.equal('bar');
		$(node()).removeClass('bar');
		node().className.should.equal('');
	});

	it('toggles class', () => {
		node().className = 'foo bar baz';
		node().className.should.equal('foo bar baz');
		$(node()).toggleClass('bar');
		node().className.should.equal('foo baz');
		$(node()).toggleClass('bar');
		node().className.should.equal('foo baz bar');
		$(node()).toggleClass('foo', true);
		node().className.should.equal('foo baz bar');
		$(node()).toggleClass('foo', false);
		node().className.should.equal('baz bar');
		$(node()).toggleClass('foo', false);
		node().className.should.equal('baz bar');
		$(node()).toggleClass('foo', true);
		node().className.should.equal('baz bar foo');
	});

	it('correctly reports hasClass', () => {
		node().className = 'foo bar baz';
		$(node()).hasClass('foo').should.equal(true);
		$(node()).hasClass('bar').should.equal(true);
		$(node()).hasClass('baz').should.equal(true);
		$(node()).hasClass('buz').should.equal(false);
		$(node()).hasClass('o b').should.equal(false);
	});
});

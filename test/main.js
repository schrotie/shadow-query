/* global chai */
chai.should();

fetch('/test').then(res => res.text()).then(text => {
	const exclude = /test|main|eslintrc/;
	const match = text.match(/(\w+)\.js/g);
	const files = [];
	for(let file of match) if(!exclude.test(file) && files.indexOf(file) === -1){
		files.push(file);
	}
	Promise.all(files.map(file => import(`./${file}`)))
	.then(() => {
		mocha.checkLeaks();
		mocha.run();
	});
});

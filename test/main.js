fetch('/test').then(res => res.text()).then(text => {
	const files = text.match(/\/test\/(?!(test|main))(\w+)\.js/g);
	Promise.all(files.map(file => import(file)))
	.then(() => {
		mocha.checkLeaks();
		mocha.run();
	})
});

const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const minify = require('minify');
const { promisify } = require('util');

const SOURCE_DIR = path.join(__dirname, 'src');
const  BUILD_DIR = path.join(__dirname, 'build');

const options = {
	html: {
		removeAttributeQuotes: false,
		removeOptionalTags: false,
	},
	img: {
		maxSize: 0
	}
};

const gl = promisify(glob.glob);

(async () => {

const matches = await gl(`${SOURCE_DIR}/**/*`, { nodir: true });

for (const match of matches) {
	const file = match.substring(SOURCE_DIR.length + 1);
	const newLocation = path.join(__dirname, 'build', file);
	const extension = path.extname(file);
	try {
		let minified;
		if (extension === '.json')
			minified = JSON.stringify(JSON.parse(await fs.readFile(match)));
		else
			minified = await minify(match, options);
		await fs.outputFile(newLocation, minified);
		console.log(`Successfully minified: ${path.basename(file)}`);
	} catch(e) {
		await fs.outputFile(newLocation, await fs.readFile(match));
		console.log(`Feiled to minify, copying as is: ${path.basename(file)}`);
	}
}

})();
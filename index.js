const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const minify = require('minify');
const { promisify } = require('util');

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

const matches = await gl('./src/*');

for (const match of matches) {
	const filename = path.basename(match);
	const minified = await minify(match, options);
	await fs.writeFile(path.join(__dirname, 'build', filename), minified);
}

})();
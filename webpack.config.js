var webpack = require('webpack');
var path  = require('path');

const BUILD_DIR = path.resolve(path.join(__dirname, 'public','javascripts'));
const APP_DIR = path.resolve(path.join(__dirname, 'modules','reviews'));

const config = {
	entry: [APP_DIR + "/index.jsx"],
	output: {
		path: BUILD_DIR,
		filename: 'reviews.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				include: APP_DIR,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	}
};

module.exports = config;

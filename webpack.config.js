var path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: './src/game.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [{test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/'}]
	},
	devServer: {
		contentBase: path.resolve(__dirname, './dist/'),
		host: '127.0.0.1',
		port: 8080,
		open: true
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new CopyWebpackPlugin([
			'index.html',
			'src/styles.css',
			{from: 'assets', to: 'assets'}
		])
	]
};

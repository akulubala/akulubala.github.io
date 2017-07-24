let webpack = require('webpack');
let path = require('path');
let glob = require('glob-all');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let PurifyCSSPlugin = require('purifycss-webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');

let inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
	entry: {
		app: [
			path.resolve(__dirname, 'resources/js/main.js'),
			path.resolve(__dirname, 'resources/css/main.css'),
			path.resolve(__dirname, 'resources/sass/font-awesome-icons.scss')
		],
		vendor: ['jquery', 'lodash', 'materialize-css', 'responsive-social-buttons', 'lunr']
	},
	output: {
		path: path.resolve(__dirname, 'assets/dist'),
		filename: '[name].[chunkhash].js' // [name] point to entry { app } value, chunkhash will give every file a unique hash
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: ["css-loader"],
					fallback: "style-loader"
				})
			},
			{
				test: /\.scss$/,
		        use: ExtractTextPlugin.extract({
		          fallback: 'style-loader',
		          //resolve-url-loader may be chained before sass-loader if necessary
		          use: ['css-loader', 'resolve-url-loader', 'sass-loader']
		        })
			},
			{ 	
				test: /\.js$/, 
				exclude: /node_modules/, 
				loader: "babel-loader" 
			},
			{
				test: /\.(eot|ttf|woff|woff2)(\?[a-z0-9=&.]+)?$/,
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]'
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: 'images/[name].[hash].[ext]'
				}
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist'], {
			root: path.join(__dirname, 'assets'),
			verbose: true, // write logs to console
			dry: false // emulate delete?
		}),
		new ExtractTextPlugin("[name].[chunkhash].css"), // extract css to file, [name] use entry file name
		new webpack.LoaderOptionsPlugin({
			minimize: inProduction
		}),
	    new webpack.ProvidePlugin({
		  $: 'jquery',
		  jQuery: "jquery",
		  'window.$': 'jquery',
		  'window.jQuery': 'jquery'
		}),
		new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest'] // 指定公共 bundle 的名字。
        }),
        new PurifyCSSPlugin({
			// Give paths to parse for rules. These should be absolute!
			paths: glob.sync([
			   path.resolve(__dirname, '../site/**/*.html')
			]),
			minimize: true,
			purifyOptions: {
			    whitelist: ['*sidenav*', '*sweet*', '*rrssb*'] // css or id should not be purify
			}
	    }),
	    function() {
	    	this.plugin('done', stats => {
				require('fs').writeFileSync(
					path.join(__dirname, '_data/manifest.json'),
					JSON.stringify(stats.toJson().assetsByChunkName)
				);
	    	});
	    }
	]
};

const lodash = require('lodash');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const path = require('path');

function srcPaths(src) {
  return path.join(__dirname, src);
}

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';

// #region Common settings
const commonConfig = {
	devtool: isEnvDevelopment ? "source-map" : false,
	mode: isEnvProduction ? "production" : "development",
	output: { path: srcPaths("dist") },
	node: { __dirname: false, __filename: false },
	resolve: {
		alias: {
			_: srcPaths("src"),
			_main: srcPaths("src/main"),
			_models: srcPaths("src/models"),
			_language: srcPaths("src/language"),
			_public: srcPaths("public"),
			_renderer: srcPaths("src/renderer"),
			_utils: srcPaths("src/utils"),
		},
		extensions: [".js", ".json", ".ts", ".tsx"],
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				loader: "ts-loader",
			},
			{
				test: /\.(scss|css)$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(jpg|png|svg|ico|icns|ttf|otf)$/,
				loader: "file-loader",
				options: {
					name: "[path][name].[ext]",
				},
			},
		],
	},
}
// #endregion

const mainConfig = lodash.cloneDeep(commonConfig)
mainConfig.entry = "./src/main/main.ts"
mainConfig.target = "electron-main"
mainConfig.output.filename = "main.bundle.js"
mainConfig.plugins = [
	new CopyPlugin({
		patterns: [
			{
				from: "package.json",
				to: "package.json",
				transform: (content, _path) => {
					// eslint-disable-line no-unused-vars
					const jsonContent = JSON.parse(content)

					delete jsonContent.devDependencies
					delete jsonContent.scripts
					delete jsonContent.build

					jsonContent.main = "./main.bundle.js"
					jsonContent.scripts = { start: "electron ./main.bundle.js" }
					jsonContent.postinstall = "electron-builder install-app-deps"

					return JSON.stringify(jsonContent, undefined, 2)
				},
			},
		],
	}),
]

const BASE_LIVE_PORT = 8500
let LIVE_PORT = BASE_LIVE_PORT

const rendererConfig = lodash.cloneDeep(commonConfig)
rendererConfig.entry = "./src/renderer/renderer.tsx"
rendererConfig.target = "electron-renderer"
rendererConfig.output.filename = "renderer.bundle.js"
rendererConfig.plugins = [
	new HtmlWebpackPlugin({
		template: path.resolve(__dirname, "./public/index.html"),
	}),
	new CopyPlugin({
		patterns: [
			{
				from: "public/test.html",
				to: "public/test.html",
			},
		],
	}),
	new MonacoWebpackPlugin({
		// available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
		languages: ["json", "html", "ini", "typescript", "javascript"],
	}),
	new LiveReloadPlugin({
		protocol: "http",
		hostname: "localhost",
		appendScriptTag: true,
		port: LIVE_PORT,
		delay: 250,
	}),
]

LIVE_PORT += 10

const runtimeConfig = lodash.cloneDeep(commonConfig)
runtimeConfig.entry = "./src/runtime/runtime.tsx"
runtimeConfig.target = "electron-renderer"
runtimeConfig.output.filename = "runtime.bundle.js"
runtimeConfig.plugins = [
	new CopyPlugin({
		patterns: [
			{
				from: "public/charmap.png",
				to: "public/charmap.png",
			},
		],
	}),
	new HtmlWebpackPlugin({
		template: path.resolve(__dirname, "./public/index.html"),
		filename: "runtime.html",
	}),
	new LiveReloadPlugin({
		protocol: "http",
		hostname: "localhost",
		port: LIVE_PORT,
		appendScriptTag: true,
		delay: 250,
	}),
]

const qbasicLanguageWorker = {
	entry: "./src/language/qbasic.worker.ts",
	target: "webworker",
	devtool: isEnvDevelopment ? "source-map" : false,
	mode: isEnvProduction ? "production" : "development",
	output: { path: srcPaths("dist"), filename: "qbasic.worker.bundle.js" },
	node: { __dirname: false, __filename: false },
	resolve: {
		alias: {
			_: srcPaths("src"),
			_models: srcPaths("src/models"),
			_utils: srcPaths("src/utils"),
		},
		extensions: [".js", ".json", ".ts", ".tsx"],
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				loader: "ts-loader",
			},
		],
	},
}

module.exports = [
	mainConfig,
	rendererConfig,
	runtimeConfig,
	qbasicLanguageWorker,
]
























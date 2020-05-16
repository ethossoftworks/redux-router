const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const libraryFileName = "redux-router"
const libraryName = "ReduxRouter"

const prodConfig = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    plugins: [new CleanWebpackPlugin()],
    entry: {
        core: `./src/index.ts`, // Prevents code duplication of effects and prevents EffectSymbol from being re-declared
        components: `./src/components/index.ts`,
    },
    externals: {
        react: "react",
        redux: "redux",
        "react-redux": "react-redux",
    },
    output: {
        filename: `${libraryFileName}.[name].js`,
        path: path.resolve(__dirname, "build"),
        library: [libraryName, "[name]"],
        libraryTarget: "umd",
        globalObject: "this",
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
}

const testConfig = {
    ...prodConfig,
    ...{
        devtool: "source-map",
        entry: `./src/index.test.ts`,
        mode: "development",
        target: "node",
        output: {
            filename: `${libraryFileName}.test.js`,
            path: path.resolve(__dirname, "build"),
        },
        optimization: {},
    },
}

module.exports = (env) => {
    switch (env) {
        case "prod":
            return prodConfig
        case "test":
            return testConfig
    }
}

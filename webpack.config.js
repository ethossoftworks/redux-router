const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const fs = require("fs")

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
        core: { import: `./src/index.ts` },
        components: { import: `./src/components/index.ts`, dependOn: "core" }, // Prevents code duplication of effects and prevents EffectSymbol from being re-declared
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
        entry: `./src/index.test.tsx`,
        mode: "development",
        target: "node",
        externals: {},
        output: {
            filename: `${libraryFileName}.test.js`,
            path: path.resolve(__dirname, "build"),
        },
        optimization: {},
        plugins: [
            new CleanWebpackPlugin(),
            {
                apply: (compiler) => {
                    compiler.hooks.done.tap("ReduxRouterPostScript", (compilation) => {
                        fs.copyFileSync("./test/test.html", "./build/index.html")
                    })
                },
            },
        ],
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

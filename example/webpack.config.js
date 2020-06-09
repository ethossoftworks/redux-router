const path = require("path")
const fs = require("fs")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const packageName = "redux-router-example"
const entryFile = "index"

const prodConfig = {
    entry: `./src/${entryFile}.tsx`,
    mode: "production",
    devtool: "source-map",
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
    plugins: [
        new CleanWebpackPlugin(),
        {
            apply: (compiler) => {
                compiler.hooks.done.tap("ReduxRouterExamplePostScript", (compilation) => {
                    fs.copyFileSync("./static/index.html", "./build/index.html")
                    fs.copyFileSync("./static/main.css", "./build/main.css")
                })
            },
        },
    ],
    output: {
        filename: `${packageName}.js`,
        path: path.resolve(__dirname, "build"),
        globalObject: "this",
    },
}

const devConfig = {
    ...prodConfig,
    devtool: "source-map",
    mode: "development",
}

module.exports = (env) => {
    switch (env) {
        case "prod":
            return prodConfig
        case "dev":
            return devConfig
    }
}

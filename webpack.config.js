import path from "path"
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from "html-webpack-plugin"

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    entry : {
        main : "./src/main.ts",
        preload : "./src/preload.ts",
        renderer : "./src/renderer.ts"
    },
    mode : "development",
    target : "electron-main",
    devServer: {
        compress: true,
        port: 3000,
        hot : true,
    },
    module : {
        rules : [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules\\/,
            },
            {
                test : /\.js$/,
                exclude : /node_modules\\/
            },
            {
                test : /\.css$/,
                use : ["style-loader", "css-loader"]
            }
        ]
    },
    plugins : [
        new HtmlWebpackPlugin({
            template : "./public/index.html",
            filename : "index.html",
            chunks : ["renderer"]
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    output : {
        path : path.resolve(__dirname, "dist/"),
        filename: (pathData) => {
            return pathData.chunk.name === 'main' ? '[name].cjs' : '[name].js';
        },
    }
}
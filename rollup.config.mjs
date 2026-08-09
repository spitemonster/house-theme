import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import postcssNesting from 'postcss-nesting'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import json from '@rollup/plugin-json'
import { babel } from '@rollup/plugin-babel'
import wpResolve from 'rollup-plugin-wp-resolve'
import glob from 'fast-glob'
import path from 'path'

import dotenv from 'dotenv'
dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

const jsGlobals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@wordpress/blocks': 'wp.blocks',
    '@wordpress/i18n': 'wp.i18n',
    '@wordpress/element': 'wp.element',
    '@babel/runtime/helpers/toConsumableArray': '_toConsumableArray',
    '@babel/runtime/helpers/slicedToArray': '_slicedToArray',
}

const jsExternals = [
    'react',
    'react-dom',
    '@babel/runtime',
    '@wordpress/blocks',
    '@wordpress/i18n',
    '@wordpress/element',
    '@babel/plugin-transform-destructuring',
    '@babel/runtime/helpers/toConsumableArray',
    '@babel/runtime/helpers/slicedToArray',
]

const jsPluginConfig = [
    replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
            isProduction ? 'production' : 'development',
        ),
    }),
    resolve(),
    json({ compact: true }),
    babel({
        babelHelpers: 'runtime',
        extensions: ['.js', '.jsx'],
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]],
    }),
    wpResolve(),
]

// mangle and minify js in production
if (isProduction) {
    jsPluginConfig.push(terser())
}

const config = []

function globalJsConfig(name) {
    return {
        input: `./src/js/${name}.js`,
        output: {
            file: `./assets/js/${name}.min.js`,
            format: 'iife',
            globals: jsGlobals,
            sourcemap: !isProduction,
        },
        external: jsExternals,
        plugins: jsPluginConfig,
    }
}

function globalCssConfig(name) {
    return {
        input: `./src/css/${name}.css`,
        output: {
            file: `./assets/css/${name}.min.css`,
        },
        plugins: postcss({
            extract: true,
            minimize: isProduction,
            syntax: 'postcss-scss',
            plugins: [
                postcssImport({ root: process.cwd() }),
                autoprefixer(),
                postcssNesting(),
            ],
        }),
    }
}

// core setup for main (frontend), admin and editor scripts and styles
;['main', 'admin', 'editor'].forEach((name) => {
    config.push(globalCssConfig(name), globalJsConfig(name))
})

const blockScripts = await glob('./blocks/**/*.js')
const blockStyles = await glob('./blocks/**/*.css')

blockScripts.forEach((script) => {
    const scriptDir = path.dirname(script)
    const scriptName = path.basename(script)

    config.push({
        input: script,
        output: {
            file: `./${scriptDir}/dist/${scriptName.replace('.js', '.min.js')}`,
            format: 'iife',
            globals: jsGlobals,
            sourcemap: !isProduction,
        },
        external: jsExternals,
        plugins: [...jsPluginConfig],
    })
})

blockStyles.forEach((style) => {
    const styleDir = path.dirname(style)
    const styleName = path.basename(style)

    config.push({
        input: style,
        output: {
            file: `./${styleDir}/dist/${styleName.replace('.css', '.min.css')}`,
        },
        plugins: postcss({
            extract: true,
            minimize: isProduction,
            syntax: 'postcss-scss',
            plugins: [
                postcssImport({ root: process.cwd() }),
                autoprefixer(),
                postcssNesting(),
            ],
        }),
    })
})

export default config

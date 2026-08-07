import wordpress from '@wordpress/eslint-plugin'
import globals from 'globals'

// globals@11.x ships "AudioWorkletGlobalScope " with a trailing space, which
// ESLint 9's stricter global-name validation rejects outright. Trim as a guard.
const browserGlobals = Object.fromEntries(
    Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
)

export default [
    ...wordpress.configs.recommended,
    {
        languageOptions: {
            globals: browserGlobals,
        },
        settings: {
            // these ship as WP-provided runtime globals (see jsExternals in
            // rollup.config.mjs), not real npm installs — tell the resolver
            // not to look for them on disk
            'import/core-modules': [
                '@wordpress/block-editor',
                '@wordpress/components',
                '@wordpress/data',
                '@wordpress/api-fetch',
                '@types/react',
            ],
        },
    },
    {
        ignores: ['assets/**', 'node_modules/**', '_templates/**'],
        rules: { 'no-console': ['error', { allow: ['error', 'warn'] }] },
    },
]

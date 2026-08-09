# house theme

a modern, minimal, opinionated wordpress block theme.

## requirements

- wordpress 6.4+, php 7.4+
- node 18+

## development

### installation

`git clone` into your theme directory.

`cd house-theme`

`npm install`

`composer install` to build phpcs.

### building

building handles theme level and block level assets.

`npm run dev` to build unminified scripts and styles with source maps

`npm run watch` to do the same but watch for changes

`npm run production` build minified scripts and styles without source maps.

### linting

`vendor/bin/phpcs` to lint php against this theme's ruleset.

`npm run lint:js` to lint block scripts.

### blocks

#### block creation

includes hygen templates for simple static and dynamic block creation. run `npm run block:static` or `npm run block:dynamic` and follow the prompts to scaffold a wordpress block.

## child themes

hooks and filters have been added and code has been built to allow child themes to relatively easily hook into functionality provided by this theme.

### `house_theme_before_init`

runs before any other theme initialization, including before API and Block class init.

### `house_theme_after_init`

runs after all other initialization has been executed

### `house_theme_before_setup`

runs before general theme setup

### `house_theme_after_setup`

runs after general theme setup

### `house_theme_block_styles`

filters expecting an array of arrays in this format

```PHP
[
	string $block_slug => [
		string name
		string label
	]
]
```

registers each item in the filter result as a block style for the given block slug. default is an empty array.

### `house_theme_post_types`

filter expecting an array of arrays in this format

```PHP
[
	string $slug => [
		...WP Post Type settings array
	]
]
```

registers each item in the filter result as a post type. default is an empty array.

### `house_theme_block_directories`

filter expecting an array of arrays in this format

```PHP
[
	string $block_slug => [
		string path
	]
]
```

passes each item in the filter result to `register_block` using the given path and slug. by default, includes block directories in theme assets directory.

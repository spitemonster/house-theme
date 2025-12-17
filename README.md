# house theme

a modern, minimal, fast, opinionated wordpress block theme.

## development

### installation

`git clone` into your theme directory.

`cd house-theme`

`npm install` to build packages.

### building

building handles theme level and block level assets.

`npm run dev` to build unminified scripts and styles with source maps

`npm run watch` to do the same but watch for changes

`npm run production` build minified scripts and styles without source maps.

## optimizations

### assets

this theme is scripted to load bundled assets from the `assets` directory.

block assets are stored in a transient which updates when changes to the blocks directory are detected or every hour otherwise. on the front end, block scripts are only enqueued if they are included in a pages content (i.e. if `has_block` returns true for a given block on page load).

look at `includes/blocks.php` for more info.

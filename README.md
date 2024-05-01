# House Theme

a shopify theme built during my time with [carney](https://carney.co/).

**note** steps have been taken to obfuscate the original recipient of this theme and some of its original content and in a few places removed sections entire. as such i cannot guarantee that it will function 100% when installed and run in a shopify development setup.

## Philosophy

much of this will probably get milked for content in a blog post on my site because i'm just a real one of those guys now i guess, but for now:

the objective with this site was to offer the client (read: my project manager/content entry pal) as much flexibility as we could cram into shopify's relatively constrained layout, content and styling setup. i.e. the client wanted as much a marketing site as they wanted an ecommerce site and wanted a great deal of content flexibility _per product_ and _per collection_. we were also a very small team and though we'd just come off of another shopify project, it was pretty rough and tumble and very little of what we built could be reused for this site given the previous site's context (it's an entirely different story for an entirely different ...milking 🤮... sorry).

what i came up with was this architecture where we're more or less treating `/snippets` as sort of atomic components, `/sections` as page components and `/templates` as, well, templates or pages. in many cases `/sections` are just wrappers for `/snippets` but in other cases they are composed of multiple. the crux of this was integrating with metafields and metaobjects. metafields were often used per collection/product/page/whatever to enter content that would get picked up by one or more different types of `/snippets`; with this the client could compose different templates at their leisure with sections made from clearly defined components and metafields. in practice i felt it worked well; the site was fast and despite some initial performance (speed) issues (my fault!) it seemed to perform (sales) well.

_what follows is more-or-less the original readme........_

## Development

### installation

if you're downloading and installing this i'll assume you already know how to set up a local shopify development server. clone this repository, `cd` into it and run `npm install` to install dependencies.

### development

to run the project locally you will need to run two `npm` scripts simultaneously:

`npm run shopify:dev` will spin up a local instance of the theme and host it, by default, at `127.0.0.1:9292`

`npm run watch` will initialize a parcel service that will observe all top level `.scss, .js` files in `/dev` and hot-reload the server on update.

you do not _need_ to run `watch` for the local instance to work, but you will not see active updates to the local instance without building and refreshing.

### deployment

1. run `npm run build` to bundle and minify all top level `.scss, .js` files from `/dev` to `/my-contractor-exam/assets`.

2. run `npm run shopify:push:ENVIRONMENT` to push theme code into the live environment

### scripts

`npm run shopify:dev` to launch a local instance of the theme at `127.0.0.1:9292`

`npm run watch` to observe top-level JS and SCSS files in `/dev`. this deletes `.parcel-cache` as well as the current contents of the assets folder to ensure a clean build.

`npm run build` to bundle and minify top-level JS and SCSS files in `/dev` into `/my-contractor-exam/assets`. this deletes `.parcel-cache` as well as the current contents of the assets folder to ensure a clean build.

`npm run shopify:push:dev` to push this theme to the live theme on the development site

### code

`/dev` contains all development assets.

by default, parcel builds all top-level scss and js modules directly within the dev folder into `my-contractor-exam/assets`. this in mind, use `dev/js` and `dev/scss` to store libraries or other reusable code and pull them into modules in the top level `dev` folder as necessary.

you can include JS and CSS inside of liquid section and snippet files.

**JS**

```
<script src="{{ "scriptName.js" | asset_url }}" defer></script>
```

**CSS**

```
{{ 'sheet-name.css' | asset_url | stylesheet_tag }}
```

**NOTE**: liquid filters provide no way to add a script with async or defer, hence why we make the script element and simply set the src
**NOTE**: parcel builds JS and SCSS modules into minified JS and CSS files sharing the same name. keep this in mind when including.

## Eccentricities

every theme's got 'em and this one does too.

### Header Navigation

this theme uses Qikify Mega Menu in a sort of complex configuration. Qikify's assets on a previous production site were causing tremendous style and performance issues, blocking render, not taking styles without weird and desperate selectors and causing unnecessary suffering in the world. I often ended up fighting against Qikify's opinionated styles and had to implement some very hacky Javascript solutions for adding custom navigation elements. To mitigate these issues, I built some hacky Javascript and opinionated CSS of my own!

Qikify is currently activated but not enabled on the site. When functioning in this state, Qikify continues to store menu data in JSON in a snippet, `theme/snippets/qikify-tmenu-data`. We have added a script inlined in the header that takes this JSON data and uses it to create our navigation markup.

`theme/snippets/qikify-header-setup.liquid` contains this script. It accepts a subset of the navigation items available to the free version of Qikify. in short: it satisfies scope to the letter, runs fast and client doesn't have to pay for it.

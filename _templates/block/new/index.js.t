---
to: blocks/<%= title.toLowerCase().replaceAll(' ', '-') %>/index.js
---
import Edit from './edit'
import metadata from './block.json'
import { registerBlockType } from '@wordpress/blocks'

registerBlockType(metadata.name, {
    edit: Edit
})

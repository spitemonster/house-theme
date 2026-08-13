---
to: blocks/<%= title.toLowerCase().replaceAll(' ', '-') %>/index.js
---
import Edit from './edit'
<%_ if (type === 'static') { _%>
import Save from './save'
<%_ } _%>
import metadata from './block.json'
import { registerBlockType } from '@wordpress/blocks'

registerBlockType(metadata.name, {
    edit: Edit,
<%_ if (type === 'static') { _%>
    save: Save
<%_ } _%>
})

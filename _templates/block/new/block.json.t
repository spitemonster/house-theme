---
to: blocks/<%= title.toLowerCase().replaceAll(' ', '-') %>/block.json
---
{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "<%= namespace.toLowerCase().replaceAll(' ', '-') + "/" + title.toLowerCase().replaceAll(' ', '-') %>",
    "version": "1.0.0",
    "title": "<%= title %>",
    "category": "<%= category %>",
    "icon": "<%= icon %>",
    "description": "<%= description; %>",
    "textdomain": "<%= namespace.toLowerCase().replaceAll(' ', '-') %>",
<%_ if (block_attributes.length > 0) { _%>
    "attributes": {
<%_ block_attributes.split(',').forEach(function(attribute, index) { _%>
        "<%= attribute.trim() %>": {
            "type": "null",
            "default": "null"
        }<%= index < block_attributes.split(',').length - 1 ? ',' : '' %>
<%_ }); _%>
    },
<%_ } _%>
<%_ if (type === 'dynamic') { _%>
    "render": "file:./render.php",
<%_ } _%>
    "editorScript": "file:./dist/index.min.js",
    "editorStyle": "file:./dist/editor.min.css",
    "style": "file:./dist/style.min.css",
    "viewScript": "file:./dist/view.min.js"
}

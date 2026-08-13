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
	<% if ( block_attributes.length > 0) { %>"attributes": {
		<% block_attributes.split(',').forEach(function(attribute, index) { %>"<%= attribute.trim() %>": {
		}<%= index < block_attributes.split(',').length - 1 ? ',' : '' %>
		<% }); %>}
	<% } %>,
	"editorScript": "file:./dist/index.min.js",
    "editorStyle": "file:./dist/editor.min.css",
    "style": "file:./dist/style.min.css",
    "viewScript": "file:./dist/view.min.js"
}
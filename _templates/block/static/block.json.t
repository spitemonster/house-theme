---
to: blocks/<%= title.toLowerCase().replace(' ', '-') %>/block.json
---
{
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "<%= namespace.toLowerCase().replace(' ', '-') + "/" + title.toLowerCase().replace(' ', '-') %>",
    "version": "0.1.0",
    "title": "<%= title %>",
    "category": "<%= category %>",
    "icon": "<%= icon %>",
    "description": "<%= description; %>",
    "textdomain": "house-theme",
	<% if ( block_attributes.length > 0) { %>"attributes": {
		<% block_attributes.split(',').forEach(function(attribute, index) { %>"<%= attribute.trim() %>": {
		}<%= index < block_attributes.split(',').length - 1 ? ',' : '' %>
		<% }); %>}
	<% } %>
}
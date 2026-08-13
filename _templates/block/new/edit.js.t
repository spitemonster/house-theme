---
to: blocks/<%= title.toLowerCase().replaceAll(' ', '-') %>/edit.js
---
// <%= title.toLowerCase().replaceAll(' ', '-') %> editor script

export default function Edit({ attributes }) {
    <% if (block_attributes.length > 0) { %>const { <% block_attributes.split(',').forEach(function(attribute, index) { _%><%= attribute.trim() %><%= index < block_attributes.split(',').length - 1 ? ', ' : '' _%>
    <%_ }); %> } = attributes
<%_ } _%>
}

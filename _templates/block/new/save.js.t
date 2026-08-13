---
to: <% if (type === 'static') { %>blocks/<%= title.toLowerCase().replaceAll(' ', '-') %>/save.js<% } %>
---
// <%= title.toLowerCase().replaceAll(' ', '-') %> save script

export default function Save({ attributes }) {
    <% if (block_attributes.length > 0) { %>const { <% block_attributes.split(',').forEach(function(attribute, index) { _%><%= attribute.trim() %><%= index < block_attributes.split(',').length - 1 ? ', ' : '' _%>
    <%_ }); %> } = attributes
<%_ } _%>
}

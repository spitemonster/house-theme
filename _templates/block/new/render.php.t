---
to: <% if (type === 'dynamic') { %>blocks/<%= title.toLowerCase().replaceAll(' ', '-') %>/render.php<% } %>
---
<?php

/**
* @var array $attributes // block attributes
*/

<%_ block_attributes.split(',').forEach(function(attribute, index) { _%>
$<%= attribute.trim().split(/(?=[A-Z])/).map(w => w.toLowerCase()).join('_') %> = $attributes['<%= attribute.trim() %>'];
<%_ }); _%>
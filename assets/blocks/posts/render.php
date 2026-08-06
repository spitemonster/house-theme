<?php
	/**
	 * @var array $attributes Block attributes.
	 */
	
	$post_type = $attributes['postType'];
	$post_count = $attributes['postCount'];

	$posts = get_posts([
		'post_type' => $post_type,
		'posts_per_page' => $post_count
	])
?>
<p <?php echo get_block_wrapper_attributes(); ?>>
	<ul>
		<?php foreach ($posts as $post): ?>
			<li>
				<a href="<?= esc_url(get_permalink($post)) ?>"><?= esc_html($post->post_title); ?></a>
			</li>
		<?php endforeach; ?>
	</ul>
</p>

<?php
	/**
	 * @var array $attributes Block attributes.
	 */

	$selected_post_type = (string)$attributes["selectedPostType"] ?: "";
	$selected_posts = (array)$attributes["selectedPosts"];
	$posts_visible = (int)$attributes["postsVisible"];
	$posts_to_slide = (int)$attributes["postsToSlide"];
	$autoplay = (bool)$attributes["autoplay"];
	$loop = (bool)$attributes["loop"];

	$post_ids = array_map(function($item) {
		return (int)$item["id"];
	}, $selected_posts);

	$posts = get_posts([
		'include' => $post_ids,
		'numberposts' => count($post_ids),
		'post_type' => $selected_post_type
	]);
?>
<div class="post-slider blaze-slider" 
	data-posts-visible="<?= esc_attr($posts_visible); ?>" 
	data-posts-to-slide="<?= esc_attr($posts_to_slide); ?>" 
	data-autoplay="<?= $autoplay ? '1' : '0' ?>" 
	data-loop="<?= $loop ? '1' : '0' ?>">
	<div class="blaze-container">
		<div class="blaze-track-container">
			<ul class="blaze-track">
			<?php foreach ($posts as $post): 
				$featured_image_url = get_the_post_thumbnail_url($post);
				$image_url = $featured_image_url ?: get_option("fallback_image");

				$permalink = get_the_permalink($post);
				?>
				<li>
					<a class="post-card" href="<?= esc_url($permalink); ?>">
						<figure>
							<?php if (!empty($image_url)): ?>
								<img src="<?= esc_url($image_url) ?>" alt="<?= esc_attr($post->post_title); ?>">
							<?php endif; ?>

							<figcaption>
								<?= esc_html($post->post_excerpt) ?: esc_html($post->post_title); ?>
							</figcaption>
						</figure>
					</a>
				</li>
			<?php endforeach; ?>
			</ul>
		</div>
	</div>
</div>
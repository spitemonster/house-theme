<?php
	/**
	 * @var array $attributes Block attributes.
	 * @var array $content block inner content
	 */

	$selected_post_type = (string)$attributes["selectedPostType"] ?: "";
	$selected_posts = (array)$attributes["selectedPosts"];
	$posts_visible = (int)$attributes["postsVisible"];
	$posts_to_slide = (int)$attributes["postsToSlide"];
	$autoplay = (bool)$attributes["autoplay"];
	$loop = (bool)$attributes["loop"];

	$post_ids = array_map(function ($item) {
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
			<?php foreach ($posts as $index => $post) :
				$post_thumb_id = get_post_thumbnail_id($post);

				$permalink = get_the_permalink($post);
				?>
				<li>
					<a class="post-card" href="<?= esc_url($permalink); ?>">
						<figure>
							<?php if (!empty($post_thumb_id)) :
								echo wp_get_attachment_image($post_thumb_id, 'medium_large', false, [
									'alt' => esc_attr($post->post_title),
									'loading' => $index === 0 ? 'eager' : 'lazy',
									'sizes' => '(min-width: 782px) 33vw, 100vw'
								]);
								?>
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
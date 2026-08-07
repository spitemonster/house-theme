<?php
namespace House_Theme;

final class Blocks {
	private const BLOCK_SCOPE_NAME = 'house-theme';
	private static array $block_dirs;

	public static function init(): void {
		add_action('init', [self::class, 'register_blocks']);
		add_action('init', [self::class, 'register_block_styles']);

		// enqueue editor scripts and styles
		add_action('enqueue_block_editor_assets', [self::class, 'enqueue_block_editor_assets']);

		// front end scripts and styles
		add_action('enqueue_block_assets', [self::class, 'enqueue_frontend_block_assets']);
	}

	public static function register_blocks(): void {
		$block_dirs = self::get_block_directories();

		foreach ($block_dirs as $block) {
			$block_path = $block['path'];
			$block_json = $block_path . 'block.json';

			if (!file_exists($block_json)) {
				continue;
			}

			register_block_type($block_json);
		}
	}

	public static function register_block_styles(): void {
		$block_styles = apply_filters('house_theme_block_styles', []);

		foreach ($block_styles as $slug => $settings) {
			register_block_style($slug, [
				'name' => $settings['name'],
				'label' => $settings['label'],
			]);
		}
	}

	/**
	 * retrieve or invalidate block view asset transient and enqueue block view scripts and styles
	 * @return void
	 */
	public static function enqueue_frontend_block_assets(): void {
		$block_dirs = self::get_block_directories();

		// get most recently updated file from block asset directories
		// (checks the files themselves, not just the directory, so edits
		// to an existing view.js/style.css also bust the cache)
		$block_cache_key = 'block_view_assets';
		$last_modified = array_reduce($block_dirs, function ($carry, $block) {
			$path = $block['path'];
			$files = glob($path . '*') ?: [];
			$files[] = $path;

			$dir_last_modified = array_reduce($files, fn($max, $file) => max($max, filemtime($file)), 0);

			return max($carry, $dir_last_modified);
		}, 0);

		// get cached last modified timestamp
		$cached_last_modified = get_transient($block_cache_key . '_timestamp');

		// refresh transient if files have been updated since transient was set
		if ($cached_last_modified != $last_modified) {
			delete_transient($block_cache_key);
			set_transient($block_cache_key . "_timestamp", $last_modified, HOUR_IN_SECONDS);
		}

		$block_assets = get_transient($block_cache_key);

		// refresh block assets transient
		if ($block_assets === false) {
			$block_assets = [];

			foreach ($block_dirs as $block) {
				$block_path = $block['path'];
				$block_slug = $block['slug'];

				$block_assets[$block_slug] = [
					'path' => $block_path,
					'uri' => $block['uri'],
					'has_script' => file_exists($block_path . 'view.js'),
					'has_style' => file_exists($block_path . 'style.css'),
					'scope' => $block['scope']
				];
			}
			set_transient($block_cache_key, $block_assets, HOUR_IN_SECONDS);
		}

		foreach ($block_assets as $block_name => $files) {
			$scoped_name = $files['scope'] . '/' . $block_name;

			if (!has_block($scoped_name)) {
				continue;
			}

			$block_dist_path = $files['path'];
			$block_dist_uri = $files['uri'];

			if ($files['has_script']) {
				wp_enqueue_script(
					$block_name . '-view-script',
					$block_dist_uri . 'view.js',
					['wp-blocks', 'wp-element'],
					filemtime($block_dist_path . 'view.js')
				);
			}

			if ($files['has_style']) {
				wp_enqueue_style(
					$block_name . '-view-style',
					$block_dist_uri . 'style.css',
					[],
					filemtime($block_dist_path . 'style.css')
				);
			}
		}
	}

	/**
	 * get filtered block directories and enqueue active blocks
	 * @return void
	 */
	public static function enqueue_block_editor_assets(): void {
		foreach (self::get_block_directories() as $block) {
			$block_slug = $block['slug'];
			$scoped_name = $block['scope'] . '/' . $block_slug;
			$block_dist_path = $block['path'];
			$block_dist_uri = $block['uri'];

			// no point in running if there's no main editor script
			if (!file_exists($block_dist_path . 'index.js')) {
				continue;
			}

			$editor_script_name = $block_slug . '-editor-script';
			$editor_style_name = $block_slug . '-editor-style';
			$view_style_name = $block_slug . '-view-style';

			wp_enqueue_script(
				$editor_script_name,
				$block_dist_uri . 'index.js',
				['wp-blocks', 'wp-element', 'wp-editor'],
				filemtime($block_dist_path . 'index.js')
			);

			if (file_exists($block_dist_path . 'editor.css') && has_block($scoped_name)) {
				wp_enqueue_style(
					$editor_style_name,
					$block_dist_uri . 'editor.css',
					[],
					filemtime($block_dist_path . 'editor.css')
				);
			}

			if (file_exists($block_dist_path . 'style.css') && has_block($scoped_name)) {
				wp_enqueue_style(
					$view_style_name,
					$block_dist_uri . 'style.css',
					[],
					filemtime($block_dist_path . 'style.css')
				);
			}
		}
	}

	/**
	 * return an array keyed by block slug containing block registration data
	 * @return array
	 */
	private static function get_block_directories(): array {
		if (!isset(self::$block_dirs)) {
			$dirs = glob(
				get_template_directory() . '/assets/blocks/*/',
				GLOB_ONLYDIR
			) ?: [];

			$block_dirs = [];

			foreach ($dirs as $path) {
				$block_slug = basename(rtrim($path, '/'));
				$uri = get_template_directory_uri() . '/assets/blocks/' . $block_slug . '/';

				$block_dirs[$block_slug] = [
					'slug' => $block_slug,
					'path' => $path,
					'uri' => $uri,
					'scope' => self::BLOCK_SCOPE_NAME
				];
			}

			self::$block_dirs = $block_dirs;
		}

		return apply_filters('house_theme_block_directories', self::$block_dirs);
	}
}
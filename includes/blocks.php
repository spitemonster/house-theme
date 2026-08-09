<?php

namespace House_Theme;

final class Blocks {
	private const BLOCK_SCOPE_NAME = 'house-theme';
	private static array $block_dirs;

	public static function init(): void {
		add_action('init', [self::class, 'register_blocks']);
		add_action('init', [self::class, 'register_block_styles']);

		add_filter('block_type_metadata', [self::class, 'set_block_meta_version_from_filemtime']);
	}

	/**
	 * register custom blocks with their block.json
	 * @return void
	 * @hooked init
	 */
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

	/**
	 * register custom block styles from house theme filter
	 * @return void
	 * @hooked init
	 */
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

	/**
	 * sets block meta version using filemtime
	 * @param mixed $metadata
	 * @hooked block_type_metadata
	 */
	public static function set_block_meta_version_from_filemtime($metadata) {
		if (!str_starts_with($metadata['name'] ?? '', 'house-theme/')) {
			return $metadata;
		}
		$dir = dirname($metadata['file']);
		$metadata['version'] = (string) max(array_map('filemtime', glob($dir . '/*') ?: [$dir]));
		return $metadata;
	}
}

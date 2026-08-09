<?php

namespace House_Theme;

final class Theme {
	public static function init() {
		do_action('house_theme_before_init');

		Api::init();
		Blocks::init();

		add_action('after_setup_theme', [self::class, 'setup']);

		add_action('init', [self::class, 'register_post_types']);

		add_action('wp_enqueue_scripts', [self::class, 'enqueue_frontend_assets']);
		add_action('admin_enqueue_scripts', [self::class, 'enqueue_admin_assets']);
		add_action('enqueue_block_assets', [self::class, 'enqueue_editor_assets']);
		do_action('house_theme_after_init');
	}

	public static function setup() {
		do_action('house_theme_before_setup');

		add_post_type_support('page', 'excerpt');
		add_theme_support('title-tag');
		add_theme_support('post-thumbnails');
		add_theme_support('html5', [
			'caption',
			'comment-form',
			'comment-list',
			'gallery',
			'search-form',
		]);

		add_theme_support('editor-styles');
		add_theme_support('wp-block-styles');
		remove_theme_support('core-block-patterns');

		do_action('house_theme_after_setup');
	}

	public static function register_post_types() {
		$post_types = apply_filters('house_theme_post_types', []);

		foreach ($post_types as $slug => $settings) {
			register_post_type($slug, $settings);
		}
	}

	public static function enqueue_frontend_assets() {
		wp_enqueue_style('main-style', get_template_directory_uri() . '/assets/css/main.min.css');
		wp_enqueue_script('main-script', get_template_directory_uri() . '/assets/js/main.min.js');
	}

	public static function enqueue_admin_assets() {
		wp_enqueue_style('admin-style', get_template_directory_uri() . '/assets/css/admin.min.css');
		wp_enqueue_script('admin-script', get_template_directory_uri() . '/assets/js/admin.min.js');
	}

	public static function enqueue_editor_assets() {
		if (is_admin()) {
			wp_enqueue_style('editor-style', get_template_directory_uri() . '/assets/css/editor.min.css');
			wp_enqueue_script(
				'editor-script',
				get_template_directory_uri() . '/assets/js/editor.min.js',
				['wp-dom-ready', 'wp-blocks', 'wp-element', 'wp-editor']
			);
		}
	}
}

<?php
/** Kickgent FSE theme setup. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function kickgent_fse_assets() {
  wp_enqueue_style( 'kickgent-fse', get_stylesheet_directory_uri() . '/assets/theme.css', array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', 'kickgent_fse_assets' );
add_action( 'after_setup_theme', function () {
  add_theme_support( 'wp-block-styles' );
  add_theme_support( 'editor-styles' );
  add_editor_style( 'assets/theme.css' );
} );

function kickgent_fse_patterns() {
  register_block_pattern_category( 'kickgent', array( 'label' => __( 'Kickgent', 'kickgent-fse' ) ) );
  register_block_pattern( 'kickgent/hero', array(
    'title' => __( 'Brokerage technology hero', 'kickgent-fse' ),
    'categories' => array( 'kickgent' ),
    'content' => '<!-- wp:group {"align":"full","className":"kg-hero"} --><div class="wp-block-group alignfull kg-hero"><!-- wp:group {"layout":{"type":"constrained"}} --><div class="wp-block-group"><!-- wp:paragraph {"className":"kg-eyebrow"} --><p class="kg-eyebrow">BROKERAGE TECHNOLOGY, CONNECTED</p><!-- /wp:paragraph --><!-- wp:heading {"level":1} --><h1>More systems than most founders expect. One clear place to start.</h1><!-- /wp:heading --><!-- wp:paragraph {"fontSize":"large"} --><p class="has-large-font-size">Turn complex brokerage technology choices into a more understandable, connected plan.</p><!-- /wp:paragraph --><!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/contact">Discuss your setup</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group --></div><!-- /wp:group -->'
  ) );
}
add_action( 'init', 'kickgent_fse_patterns' );

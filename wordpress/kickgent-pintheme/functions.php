<?php
if (!defined('ABSPATH')) exit;

require_once get_theme_file_path('inc/settings.php');

function pintheme_kickgent_setup() {
    load_theme_textdomain('kickgent-pintheme', get_template_directory() . '/languages');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', [
        'height' => 96,
        'width' => 320,
        'flex-height' => true,
        'flex-width' => true,
        'unlink-homepage-logo' => true,
    ]);
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    register_nav_menus([
        'primary' => __('Primary navigation', 'kickgent-pintheme'),
        'footer' => __('Footer navigation', 'kickgent-pintheme'),
    ]);
}
add_action('after_setup_theme', 'pintheme_kickgent_setup');

function pintheme_kickgent_assets() {
    $version = wp_get_theme()->get('Version');
    wp_enqueue_style('pintheme-kickgent', get_theme_file_uri('assets/theme.css'), [], $version);
    $parity_path = get_theme_file_path('assets/source-parity.css');
    if (file_exists($parity_path)) {
        wp_enqueue_style('pintheme-source-parity', get_theme_file_uri('assets/source-parity.css'), ['pintheme-kickgent'], (string) filemtime($parity_path));
    }
    wp_enqueue_script('pintheme-kickgent', get_theme_file_uri('assets/theme.js'), [], $version, true);
    wp_add_inline_style('pintheme-kickgent', pintheme_kickgent_custom_css());
}
add_action('wp_enqueue_scripts', 'pintheme_kickgent_assets');

function pintheme_kickgent_menu_fallback() {
    $solutions = [
        'MT4 Grey Label' => 'mt4-grey-label', 'MT5 Grey Label' => 'mt5-grey-label',
        'Forex Broker CRM' => 'forex-broker-crm', 'PAMM & MAM Plugins' => 'pamm-mam',
        'Liquidity & Bridge' => 'forex-liquidity-bridge', 'Broker Website' => 'forex-broker-website',
    ];
    $guides = [
        'Start a Brokerage' => 'how-to-start-forex-brokerage',
        'Scale Your Brokerage' => 'scale-forex-brokerage',
        'Turnkey Brokerage' => 'turnkey-grey-label',
    ];
    echo '<ul class="pintheme-menu">';
    echo '<li><a href="' . esc_url(home_url('/')) . '">' . esc_html__('Home', 'kickgent-pintheme') . '</a></li>';
    echo '<li class="menu-item-has-children"><button class="pintheme-submenu-toggle" type="button" aria-expanded="false">' . esc_html__('Solutions', 'kickgent-pintheme') . '<span aria-hidden="true">⌄</span></button><ul class="sub-menu">';
    foreach ($solutions as $label => $slug) echo '<li><a href="' . esc_url(home_url('/' . $slug . '/')) . '">' . esc_html($label) . '</a></li>';
    echo '</ul></li><li class="menu-item-has-children"><button class="pintheme-submenu-toggle" type="button" aria-expanded="false">' . esc_html__('Guides', 'kickgent-pintheme') . '<span aria-hidden="true">⌄</span></button><ul class="sub-menu">';
    foreach ($guides as $label => $slug) echo '<li><a href="' . esc_url(home_url('/' . $slug . '/')) . '">' . esc_html($label) . '</a></li>';
    echo '</ul></li><li><a href="' . esc_url(home_url('/about/')) . '">' . esc_html__('About', 'kickgent-pintheme') . '</a></li></ul>';
}

function pintheme_kickgent_body_classes($classes) {
    $classes[] = 'pintheme-kickgent';
    return $classes;
}
add_filter('body_class', 'pintheme_kickgent_body_classes');

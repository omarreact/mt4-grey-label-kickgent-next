<?php
if (!defined('ABSPATH')) exit;

require_once get_theme_file_path('inc/settings.php');

function pintheme_greylabel_setup() {
    load_theme_textdomain('greylabel-technology', get_template_directory() . '/languages');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', [
        'height' => 100,
        'width' => 320,
        'flex-height' => true,
        'flex-width' => true,
        'unlink-homepage-logo' => true,
    ]);
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    register_nav_menus([
        'primary' => __('Primary navigation', 'greylabel-technology'),
        'footer' => __('Footer navigation', 'greylabel-technology'),
    ]);
}
add_action('after_setup_theme', 'pintheme_greylabel_setup');

function pintheme_greylabel_assets() {
    $version = wp_get_theme()->get('Version');
    wp_enqueue_style('greylabel-theme', get_theme_file_uri('assets/css/theme.css'), [], $version);

    $parity_path = get_theme_file_path('assets/css/source-parity.css');
    if (file_exists($parity_path)) {
        wp_enqueue_style('greylabel-source-parity', get_theme_file_uri('assets/css/source-parity.css'), ['greylabel-theme'], (string) filemtime($parity_path));
    }

    wp_enqueue_script('greylabel-theme', get_theme_file_uri('assets/js/theme.js'), [], $version, true);
    wp_add_inline_style('greylabel-theme', pintheme_greylabel_custom_css());
}
add_action('wp_enqueue_scripts', 'pintheme_greylabel_assets');

function pintheme_greylabel_menu_fallback() {
    $solutions = [
        'MT4 Grey Label' => 'mt4-grey-label',
        'MT5 Grey Label' => 'mt5-grey-label',
        'Forex Broker CRM' => 'forex-broker-crm',
        'PAMM & MAM Plugins' => 'pamm-mam',
        'Liquidity & Bridge' => 'forex-liquidity-bridge',
        'Broker Website' => 'forex-broker-website',
    ];
    $guides = [
        'Start a Brokerage' => 'how-to-start-forex-brokerage',
        'Scale Your Brokerage' => 'scale-forex-brokerage',
        'Turnkey Brokerage' => 'turnkey-grey-label',
    ];

    echo '<ul class="pintheme-menu">';
    echo '<li><a href="' . esc_url(home_url('/')) . '">' . esc_html__('Home', 'greylabel-technology') . '</a></li>';
    echo '<li class="menu-item-has-children"><button class="pintheme-submenu-toggle" type="button" aria-expanded="false">' . esc_html__('Solutions', 'greylabel-technology') . '<span aria-hidden="true">⌄</span></button><ul class="sub-menu">';
    foreach ($solutions as $label => $slug) {
        echo '<li><a href="' . esc_url(home_url('/' . $slug . '/')) . '">' . esc_html($label) . '</a></li>';
    }
    echo '</ul></li>';
    echo '<li class="menu-item-has-children"><button class="pintheme-submenu-toggle" type="button" aria-expanded="false">' . esc_html__('Guides', 'greylabel-technology') . '<span aria-hidden="true">⌄</span></button><ul class="sub-menu">';
    foreach ($guides as $label => $slug) {
        echo '<li><a href="' . esc_url(home_url('/' . $slug . '/')) . '">' . esc_html($label) . '</a></li>';
    }
    echo '</ul></li>';
    echo '<li><a href="' . esc_url(home_url('/about/')) . '">' . esc_html__('About', 'greylabel-technology') . '</a></li>';
    echo '</ul>';
}

function pintheme_greylabel_body_classes($classes) {
    $classes[] = 'pintheme-greylabel';
    return $classes;
}
add_filter('body_class', 'pintheme_greylabel_body_classes');

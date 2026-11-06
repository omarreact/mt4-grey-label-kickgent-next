<?php
if(!defined('ABSPATH'))exit;
function kickgent_fse_assets(){$v=wp_get_theme()->get('Version');wp_enqueue_style('kickgent-fse',get_stylesheet_directory_uri().'/assets/theme.css',[],$v);$css=get_theme_file_path('assets/source-parity.css');if(file_exists($css))wp_enqueue_style('kickgent-source-parity',get_theme_file_uri('assets/source-parity.css'),['kickgent-fse'],filemtime($css));}
add_action('wp_enqueue_scripts','kickgent_fse_assets');add_action('after_setup_theme',function(){add_theme_support('wp-block-styles');add_theme_support('editor-styles');add_theme_support('title-tag');add_theme_support('block-template-parts');add_theme_support('align-wide');add_editor_style(['assets/theme.css','assets/source-parity.css']);});

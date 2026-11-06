<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); $pt = pintheme_greylabel_settings(); ?>
<a class="screen-reader-text" href="#main"><?php esc_html_e('Skip to main content', 'greylabel-technology'); ?></a>
<header class="pintheme-header">
  <div class="pintheme-shell pintheme-header-inner">
    <a class="pintheme-brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>">
      <?php
      if (has_custom_logo()) {
          $logo_id = get_theme_mod('custom_logo');
          echo wp_get_attachment_image($logo_id, 'full', false, ['class' => 'pintheme-logo']);
      } else {
          echo '<span class="pintheme-mark" aria-hidden="true"></span><span>' . esc_html($pt['short_brand_name'] ?: 'GreyLabel') . '</span>';
      }
      ?>
    </a>
    <button class="pintheme-menu-toggle" type="button" aria-expanded="false" aria-controls="pintheme-primary-navigation">
      <span class="screen-reader-text"><?php esc_html_e('Toggle navigation', 'greylabel-technology'); ?></span>
      <span aria-hidden="true">☰</span>
    </button>
    <nav id="pintheme-primary-navigation" class="pintheme-navigation" aria-label="<?php esc_attr_e('Primary navigation', 'greylabel-technology'); ?>">
      <?php wp_nav_menu([
          'theme_location' => 'primary',
          'container' => false,
          'menu_class' => 'pintheme-menu',
          'fallback_cb' => 'pintheme_greylabel_menu_fallback',
          'depth' => 2,
      ]); ?>
    </nav>
    <?php if (!empty($pt['cta_label']) && !empty($pt['cta_url'])): ?>
      <a class="pintheme-cta" href="<?php echo esc_url($pt['cta_url'], ['http','https','mailto']); ?>">
        <?php echo esc_html($pt['cta_label']); ?> <span aria-hidden="true">↗</span>
      </a>
    <?php endif; ?>
  </div>
</header>

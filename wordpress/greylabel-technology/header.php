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
    <div class="pintheme-header-social">
      <?php if (!empty($pt['social_whatsapp'])): ?><a href="<?php echo esc_url($pt['social_whatsapp']); ?>" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 8.1c.4 3.6 3 6.2 6.5 7.2l1.3-1.7 2 .9c-.2 1.8-1.6 3-3.4 3-4.8-.2-8.6-4-8.8-8.8 0-1.4.8-2.7 2.1-3.3l.9 2-.6.7Z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></a><?php endif; ?>
      <?php if (!empty($pt['social_telegram'])): ?><a href="<?php echo esc_url($pt['social_telegram']); ?>" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 4-3 15-5-3.6-2.4 2.3.4-4.8L17 6.7 7.9 12.5 3 11Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></a><?php endif; ?>
    </div>
    <?php if (!empty($pt['cta_label']) && !empty($pt['cta_url'])): ?>
      <a class="pintheme-cta" href="<?php echo esc_url($pt['cta_url'], ['http','https','mailto']); ?>">
        <?php echo esc_html($pt['cta_label']); ?> <span aria-hidden="true">↗</span>
      </a>
    <?php endif; ?>
  </div>
</header>

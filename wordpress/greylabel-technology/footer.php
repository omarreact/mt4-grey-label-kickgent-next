<?php $pt = pintheme_greylabel_settings(); ?>
<footer class="pintheme-footer">
  <div class="pintheme-shell pintheme-footer-grid">
    <div>
      <a class="pintheme-brand pintheme-footer-brand" href="<?php echo esc_url(home_url('/')); ?>">
        <?php if (!empty($pt['footer_logo_url'])): ?>
          <img class="pintheme-logo" src="<?php echo esc_url($pt['footer_logo_url']); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>">
        <?php else: ?>
          <span class="pintheme-mark" aria-hidden="true"></span>
          <span><?php echo esc_html($pt['short_brand_name'] ?: 'GreyLabel'); ?></span>
        <?php endif; ?>
      </a>
      <p><?php echo esc_html(get_bloginfo('description') ?: 'MT4 & MT5 grey label solutions, CRM, PAMM/MAM plugins, liquidity connectivity and broker websites.'); ?></p>
    </div>
    <div>
      <strong><?php esc_html_e('Explore', 'greylabel-technology'); ?></strong>
      <?php wp_nav_menu(['theme_location'=>'footer','container'=>false,'fallback_cb'=>false,'depth'=>1]); ?>
    </div>
    <div>
      <strong><?php esc_html_e('Contact', 'greylabel-technology'); ?></strong>
      <?php if (!empty($pt['contact_email'])): ?><a href="mailto:<?php echo esc_attr($pt['contact_email']); ?>"><?php echo esc_html($pt['contact_email']); ?></a><?php endif; ?>
      <?php if (!empty($pt['social_whatsapp'])): ?><a href="<?php echo esc_url($pt['social_whatsapp']); ?>">WhatsApp</a><?php endif; ?>
      <?php if (!empty($pt['social_telegram'])): ?><a href="<?php echo esc_url($pt['social_telegram']); ?>">Telegram</a><?php endif; ?>
      <a href="<?php echo esc_url(home_url('/how-to-start-forex-brokerage/')); ?>"><?php esc_html_e('Brokerage launch guide', 'greylabel-technology'); ?></a>
    </div>
  </div>
  <div class="pintheme-shell pintheme-footer-bottom"><?php echo esc_html($pt['footer_text']); ?></div>
</footer>
<?php wp_footer(); ?>
</body></html>

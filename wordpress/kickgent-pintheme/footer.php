<?php $pt = pintheme_kickgent_settings(); ?>
<footer class="pintheme-footer">
  <div class="pintheme-shell pintheme-footer-grid">
    <div><a class="pintheme-brand pintheme-footer-brand" href="<?php echo esc_url(home_url('/')); ?>"><span class="pintheme-mark" aria-hidden="true"></span><span><?php echo esc_html(get_bloginfo('name') ?: 'GreyLabel'); ?></span></a><p><?php echo esc_html(get_bloginfo('description') ?: 'MT4 & MT5 grey label solutions, CRM, PAMM/MAM plugins, liquidity connectivity and broker websites.'); ?></p></div>
    <div><strong><?php esc_html_e('Explore', 'kickgent-pintheme'); ?></strong><?php wp_nav_menu(['theme_location'=>'footer','container'=>false,'fallback_cb'=>false,'depth'=>1]); ?></div>
    <div><strong><?php esc_html_e('Contact', 'kickgent-pintheme'); ?></strong><a href="mailto:admin@pincodeit.com">admin@pincodeit.com</a><a href="<?php echo esc_url(home_url('/how-to-start-forex-brokerage/')); ?>"><?php esc_html_e('Brokerage launch guide', 'kickgent-pintheme'); ?></a></div>
  </div>
  <div class="pintheme-shell pintheme-footer-bottom"><?php echo esc_html($pt['footer_text']); ?></div>
</footer>
<?php wp_footer(); ?>
</body></html>

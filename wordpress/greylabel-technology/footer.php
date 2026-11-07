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
      <?php if (!empty($pt['contact_phone'])): ?><a href="tel:<?php echo esc_attr(preg_replace('/[^+0-9]/', '', $pt['contact_phone'])); ?>"><?php echo esc_html($pt['contact_phone']); ?></a><?php endif; ?>
      <div class="pintheme-footer-social">
        <?php if (!empty($pt['social_whatsapp'])): ?><a href="<?php echo esc_url($pt['social_whatsapp']); ?>" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 8.1c.4 3.6 3 6.2 6.5 7.2l1.3-1.7 2 .9c-.2 1.8-1.6 3-3.4 3-4.8-.2-8.6-4-8.8-8.8 0-1.4.8-2.7 2.1-3.3l.9 2-.6.7Z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></a><?php endif; ?>
        <?php if (!empty($pt['social_telegram'])): ?><a href="<?php echo esc_url($pt['social_telegram']); ?>" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 4-3 15-5-3.6-2.4 2.3.4-4.8L17 6.7 7.9 12.5 3 11Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></a><?php endif; ?>
      </div>
      <a href="<?php echo esc_url(home_url('/how-to-start-forex-brokerage/')); ?>"><?php esc_html_e('Brokerage launch guide', 'greylabel-technology'); ?></a>
    </div>
  </div>
  <div class="pintheme-shell pintheme-footer-bottom"><?php echo esc_html($pt['footer_text']); ?></div>
</footer>
<button id="pintheme-scroll-top" class="pintheme-scroll-top" type="button" aria-label="Scroll to top">↑</button>
<?php wp_footer(); ?>
</body></html>

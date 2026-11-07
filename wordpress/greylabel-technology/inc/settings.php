<?php
if (!defined('ABSPATH')) exit;

function pintheme_greylabel_defaults() {
    return [
        'short_brand_name' => 'GreyLabel',
        'primary' => '#9448f7',
        'secondary' => '#24102f',
        'accent' => '#d69aff',
        'background' => '#100414',
        'surface' => '#24102f',
        'text' => '#fcf8ff',
        'muted' => '#c7b6d0',
        'header_background' => '#100414',
        'footer_background' => '#0d0312',
        'container_width' => 1180,
        'section_spacing' => 72,
        'card_radius' => 17,
        'button_radius' => 11,
        'logo_width' => 150,
        'logo_height' => 52,
        'header_height' => 76,
        'header_padding' => 20,
        'navigation_size' => 14,
        'menu_spacing' => 21,
        'mobile_spacing' => 16,
        'heading_font' => 'Inter, system-ui, sans-serif',
        'body_font' => 'Inter, system-ui, sans-serif',
        'sticky_header' => 1,
        'transparent_header' => 0,
        'cta_label' => 'Get Started',
        'cta_url' => home_url('/contact/'),
        'alternative_logo_url' => '',
        'footer_logo_url' => '',
        'footer_text' => '© 2026 GreyLabel Technology. Technology services only — not investment advice.',
        'contact_email' => 'admin@pincodeit.com',
        'social_whatsapp' => '',
        'social_telegram' => '',
    ];
}

function pintheme_greylabel_settings() {
    return wp_parse_args((array) get_option('pintheme_greylabel_settings', []), pintheme_greylabel_defaults());
}

function pintheme_greylabel_sanitize_settings($input) {
    $defaults = pintheme_greylabel_defaults();
    $out = $defaults;

    foreach (['primary','secondary','accent','background','surface','text','muted','header_background','footer_background'] as $key) {
        $color = sanitize_hex_color($input[$key] ?? '');
        if ($color) $out[$key] = $color;
    }

    $number_ranges = [
        'container_width' => [960, 1600],
        'section_spacing' => [24, 160],
        'card_radius' => [0, 48],
        'button_radius' => [0, 40],
        'logo_width' => [80, 360],
        'logo_height' => [30, 140],
        'header_height' => [56, 140],
        'header_padding' => [0, 64],
        'navigation_size' => [11, 24],
        'menu_spacing' => [6, 60],
        'mobile_spacing' => [8, 48],
    ];
    foreach ($number_ranges as $key => [$min, $max]) {
        $out[$key] = min($max, max($min, absint($input[$key] ?? $defaults[$key])));
    }

    $out['sticky_header'] = empty($input['sticky_header']) ? 0 : 1;
    $out['transparent_header'] = empty($input['transparent_header']) ? 0 : 1;
    $out['short_brand_name'] = sanitize_text_field($input['short_brand_name'] ?? $defaults['short_brand_name']);
    $out['heading_font'] = sanitize_text_field($input['heading_font'] ?? $defaults['heading_font']);
    $out['body_font'] = sanitize_text_field($input['body_font'] ?? $defaults['body_font']);
    $out['cta_label'] = sanitize_text_field($input['cta_label'] ?? $defaults['cta_label']);
    $out['cta_url'] = esc_url_raw($input['cta_url'] ?? $defaults['cta_url'], ['http','https','mailto']);
    $out['alternative_logo_url'] = esc_url_raw($input['alternative_logo_url'] ?? '');
    $out['footer_logo_url'] = esc_url_raw($input['footer_logo_url'] ?? '');
    $out['footer_text'] = sanitize_text_field($input['footer_text'] ?? $defaults['footer_text']);
    $out['contact_email'] = sanitize_email($input['contact_email'] ?? $defaults['contact_email']);
    $out['social_whatsapp'] = esc_url_raw($input['social_whatsapp'] ?? '');
    $out['social_telegram'] = esc_url_raw($input['social_telegram'] ?? '');
    return $out;
}

function pintheme_greylabel_register_settings() {
    register_setting('pintheme_greylabel', 'pintheme_greylabel_settings', [
        'sanitize_callback' => 'pintheme_greylabel_sanitize_settings',
    ]);
}
add_action('admin_init', 'pintheme_greylabel_register_settings');

function pintheme_greylabel_field($settings, $key, $label, $type = 'text', $extra = '') {
    printf(
        '<tr><th scope="row"><label for="pt-%1$s">%2$s</label></th><td><input id="pt-%1$s" name="pintheme_greylabel_settings[%1$s]" type="%3$s" value="%4$s" %5$s class="%6$s"></td></tr>',
        esc_attr($key),
        esc_html($label),
        esc_attr($type),
        esc_attr($settings[$key] ?? ''),
        $extra,
        $type === 'text' || $type === 'url' || $type === 'email' ? 'regular-text' : ''
    );
}

function pintheme_greylabel_settings_page() {
    if (!current_user_can('edit_theme_options')) return;
    $s = pintheme_greylabel_settings();
    ?>
    <div class="wrap">
      <h1><?php esc_html_e('GreyLabel Technology — Theme Settings', 'greylabel-technology'); ?></h1>
      <p><?php esc_html_e('Manage global brand, header, typography, spacing and footer settings without Full Site Editing.', 'greylabel-technology'); ?></p>
      <p><a class="button" href="<?php echo esc_url(admin_url('customize.php')); ?>"><?php esc_html_e('Manage WordPress logo & site icon', 'greylabel-technology'); ?></a></p>
      <form method="post" action="options.php">
        <?php settings_fields('pintheme_greylabel'); ?>

        <h2><?php esc_html_e('Brand', 'greylabel-technology'); ?></h2>
        <table class="form-table" role="presentation">
          <?php pintheme_greylabel_field($s, 'short_brand_name', 'Short brand name'); ?>
          <?php foreach ([
            'primary' => 'Primary color',
            'secondary' => 'Secondary color',
            'accent' => 'Accent color',
            'background' => 'Background',
            'surface' => 'Surface',
            'text' => 'Text',
            'muted' => 'Muted text',
            'header_background' => 'Header background',
            'footer_background' => 'Footer background',
          ] as $key => $label) pintheme_greylabel_field($s, $key, $label, 'color'); ?>
          <?php pintheme_greylabel_field($s, 'alternative_logo_url', 'Alternative logo URL', 'url'); ?>
          <?php pintheme_greylabel_field($s, 'footer_logo_url', 'Footer logo URL', 'url'); ?>
        </table>

        <h2><?php esc_html_e('Header & Navigation', 'greylabel-technology'); ?></h2>
        <table class="form-table" role="presentation">
          <?php pintheme_greylabel_field($s, 'logo_width', 'Logo width', 'number', 'min="80" max="360"'); ?>
          <?php pintheme_greylabel_field($s, 'logo_height', 'Logo height', 'number', 'min="30" max="140"'); ?>
          <?php pintheme_greylabel_field($s, 'header_height', 'Header height', 'number', 'min="56" max="140"'); ?>
          <?php pintheme_greylabel_field($s, 'header_padding', 'Header horizontal padding', 'number', 'min="0" max="64"'); ?>
          <?php pintheme_greylabel_field($s, 'navigation_size', 'Navigation font size', 'number', 'min="11" max="24"'); ?>
          <?php pintheme_greylabel_field($s, 'menu_spacing', 'Menu spacing', 'number', 'min="6" max="60"'); ?>
          <?php pintheme_greylabel_field($s, 'cta_label', 'CTA label'); ?>
          <?php pintheme_greylabel_field($s, 'cta_url', 'CTA URL', 'url'); ?>
          <tr><th scope="row"><?php esc_html_e('Header behavior', 'greylabel-technology'); ?></th><td>
            <label><input name="pintheme_greylabel_settings[sticky_header]" type="checkbox" value="1" <?php checked($s['sticky_header'], 1); ?>> <?php esc_html_e('Sticky', 'greylabel-technology'); ?></label><br>
            <label><input name="pintheme_greylabel_settings[transparent_header]" type="checkbox" value="1" <?php checked($s['transparent_header'], 1); ?>> <?php esc_html_e('Transparent background', 'greylabel-technology'); ?></label>
          </td></tr>
        </table>

        <h2><?php esc_html_e('Typography & Layout', 'greylabel-technology'); ?></h2>
        <table class="form-table" role="presentation">
          <?php pintheme_greylabel_field($s, 'heading_font', 'Heading font stack'); ?>
          <?php pintheme_greylabel_field($s, 'body_font', 'Body font stack'); ?>
          <?php pintheme_greylabel_field($s, 'container_width', 'Container width', 'number', 'min="960" max="1600"'); ?>
          <?php pintheme_greylabel_field($s, 'section_spacing', 'Section spacing', 'number', 'min="24" max="160"'); ?>
          <?php pintheme_greylabel_field($s, 'card_radius', 'Card radius', 'number', 'min="0" max="48"'); ?>
          <?php pintheme_greylabel_field($s, 'button_radius', 'Button radius', 'number', 'min="0" max="40"'); ?>
          <?php pintheme_greylabel_field($s, 'mobile_spacing', 'Mobile spacing', 'number', 'min="8" max="48"'); ?>
        </table>

        <h2><?php esc_html_e('Footer', 'greylabel-technology'); ?></h2>
        <table class="form-table" role="presentation">
          <?php pintheme_greylabel_field($s, 'contact_email', 'Contact email', 'email'); ?>
          <?php pintheme_greylabel_field($s, 'social_whatsapp', 'WhatsApp URL', 'url'); ?>
          <?php pintheme_greylabel_field($s, 'social_telegram', 'Telegram URL', 'url'); ?>
          <?php pintheme_greylabel_field($s, 'footer_text', 'Copyright / footer text'); ?>
        </table>

        <?php submit_button(); ?>
      </form>
    </div>
    <?php
}

function pintheme_greylabel_admin_menu() {
    add_theme_page(
        __('GreyLabel Theme Settings', 'greylabel-technology'),
        __('GreyLabel Theme Settings', 'greylabel-technology'),
        'edit_theme_options',
        'pintheme-settings',
        'pintheme_greylabel_settings_page'
    );
}
add_action('admin_menu', 'pintheme_greylabel_admin_menu');

function pintheme_greylabel_custom_css() {
    $s = pintheme_greylabel_settings();
    $header_bg = $s['transparent_header'] ? 'transparent' : $s['header_background'];
    return sprintf(
        ':root{--pt-primary:%1$s;--pt-secondary:%2$s;--pt-accent:%3$s;--pt-bg:%4$s;--pt-surface:%5$s;--pt-text:%6$s;--pt-muted:%7$s;--pt-container:%8$dpx;--pt-section:%9$dpx;--pt-card-radius:%10$dpx;--pt-button-radius:%11$dpx;--pt-logo-width:%12$dpx;--pt-logo-height:%13$dpx;--pt-header-height:%14$dpx;--pt-heading-font:%15$s;--pt-body-font:%16$s;--pt-nav-size:%17$dpx;--pt-menu-gap:%18$dpx;--pt-mobile-spacing:%19$dpx;--pt-footer-bg:%20$s}.pintheme-header{position:%21$s;background:%22$s}.pintheme-header-inner{padding-left:%23$dpx;padding-right:%23$dpx}',
        esc_attr($s['primary']), esc_attr($s['secondary']), esc_attr($s['accent']), esc_attr($s['background']),
        esc_attr($s['surface']), esc_attr($s['text']), esc_attr($s['muted']), absint($s['container_width']),
        absint($s['section_spacing']), absint($s['card_radius']), absint($s['button_radius']), absint($s['logo_width']),
        absint($s['logo_height']), absint($s['header_height']), esc_attr($s['heading_font']), esc_attr($s['body_font']),
        absint($s['navigation_size']), absint($s['menu_spacing']), absint($s['mobile_spacing']), esc_attr($s['footer_background']),
        $s['sticky_header'] ? 'sticky' : 'relative', esc_attr($header_bg), absint($s['header_padding'])
    );
}

<?php
if (!defined('ABSPATH')) exit;

function pintheme_kickgent_defaults() {
    return [
        'primary' => '#9b4de8',
        'primary_soft' => '#d69aff',
        'background' => '#0b0311',
        'surface' => '#1d0929',
        'text' => '#ffffff',
        'muted' => '#c8b3d3',
        'container_width' => 1180,
        'section_spacing' => 72,
        'logo_width' => 150,
        'header_height' => 76,
        'sticky_header' => 1,
        'cta_label' => 'Get Started',
        'cta_url' => 'mailto:support@fxgreylabel.com?subject=GreyLabel%20Enquiry',
        'footer_text' => '© 2026 GreyLabel Technology. Technology services only — not investment advice.',
    ];
}

function pintheme_kickgent_settings() {
    return wp_parse_args((array) get_option('pintheme_kickgent_settings', []), pintheme_kickgent_defaults());
}

function pintheme_kickgent_sanitize_settings($input) {
    $defaults = pintheme_kickgent_defaults();
    $output = $defaults;
    foreach (['primary','primary_soft','background','surface','text','muted'] as $key) {
        $color = sanitize_hex_color($input[$key] ?? '');
        if ($color) $output[$key] = $color;
    }
    $output['container_width'] = min(1600, max(960, absint($input['container_width'] ?? $defaults['container_width'])));
    $output['section_spacing'] = min(160, max(24, absint($input['section_spacing'] ?? $defaults['section_spacing'])));
    $output['logo_width'] = min(360, max(80, absint($input['logo_width'] ?? $defaults['logo_width'])));
    $output['header_height'] = min(120, max(56, absint($input['header_height'] ?? $defaults['header_height'])));
    $output['sticky_header'] = empty($input['sticky_header']) ? 0 : 1;
    $output['cta_label'] = sanitize_text_field($input['cta_label'] ?? $defaults['cta_label']);
    $output['cta_url'] = esc_url_raw($input['cta_url'] ?? $defaults['cta_url'], ['http','https','mailto']);
    $output['footer_text'] = sanitize_text_field($input['footer_text'] ?? $defaults['footer_text']);
    return $output;
}

function pintheme_kickgent_register_settings() {
    register_setting('pintheme_kickgent', 'pintheme_kickgent_settings', ['sanitize_callback' => 'pintheme_kickgent_sanitize_settings']);
}
add_action('admin_init', 'pintheme_kickgent_register_settings');

function pintheme_kickgent_settings_page() {
    if (!current_user_can('edit_theme_options')) return;
    $settings = pintheme_kickgent_settings();
    ?>
    <div class="wrap"><h1><?php echo esc_html__('PinTheme Settings', 'kickgent-pintheme'); ?></h1>
    <p><?php echo esc_html__('Edit global branding, navigation CTA, colors and spacing without using the block editor.', 'kickgent-pintheme'); ?></p>
    <form method="post" action="options.php">
      <?php settings_fields('pintheme_kickgent'); ?>
      <table class="form-table" role="presentation">
        <?php foreach (['primary'=>'Primary color','primary_soft'=>'Accent color','background'=>'Background','surface'=>'Surface','text'=>'Text','muted'=>'Muted text'] as $key=>$label): ?>
        <tr><th scope="row"><label for="pt-<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></label></th><td><input id="pt-<?php echo esc_attr($key); ?>" name="pintheme_kickgent_settings[<?php echo esc_attr($key); ?>]" type="color" value="<?php echo esc_attr($settings[$key]); ?>"></td></tr>
        <?php endforeach; ?>
        <tr><th scope="row">Container width</th><td><input name="pintheme_kickgent_settings[container_width]" type="number" min="960" max="1600" value="<?php echo esc_attr($settings['container_width']); ?>"> px</td></tr>
        <tr><th scope="row">Section spacing</th><td><input name="pintheme_kickgent_settings[section_spacing]" type="number" min="24" max="160" value="<?php echo esc_attr($settings['section_spacing']); ?>"> px</td></tr>
        <tr><th scope="row">Logo width</th><td><input name="pintheme_kickgent_settings[logo_width]" type="number" min="80" max="360" value="<?php echo esc_attr($settings['logo_width']); ?>"> px</td></tr>
        <tr><th scope="row">Header height</th><td><input name="pintheme_kickgent_settings[header_height]" type="number" min="56" max="120" value="<?php echo esc_attr($settings['header_height']); ?>"> px</td></tr>
        <tr><th scope="row">Sticky header</th><td><label><input name="pintheme_kickgent_settings[sticky_header]" type="checkbox" value="1" <?php checked($settings['sticky_header'], 1); ?>> Enabled</label></td></tr>
        <tr><th scope="row">Navigation CTA</th><td><input class="regular-text" name="pintheme_kickgent_settings[cta_label]" value="<?php echo esc_attr($settings['cta_label']); ?>"><br><input class="large-text" name="pintheme_kickgent_settings[cta_url]" value="<?php echo esc_attr($settings['cta_url']); ?>"></td></tr>
        <tr><th scope="row">Footer text</th><td><input class="large-text" name="pintheme_kickgent_settings[footer_text]" value="<?php echo esc_attr($settings['footer_text']); ?>"></td></tr>
      </table>
      <?php submit_button(); ?>
    </form></div>
    <?php
}

function pintheme_kickgent_admin_menu() {
    add_theme_page(__('PinTheme Settings', 'kickgent-pintheme'), __('PinTheme Settings', 'kickgent-pintheme'), 'edit_theme_options', 'pintheme-settings', 'pintheme_kickgent_settings_page');
}
add_action('admin_menu', 'pintheme_kickgent_admin_menu');

function pintheme_kickgent_custom_css() {
    $s = pintheme_kickgent_settings();
    return sprintf(':root{--pt-primary:%1$s;--pt-primary-soft:%2$s;--pt-bg:%3$s;--pt-surface:%4$s;--pt-text:%5$s;--pt-muted:%6$s;--pt-container:%7$dpx;--pt-section:%8$dpx;--pt-logo-width:%9$dpx;--pt-header-height:%10$dpx}.pintheme-header{position:%11$s}',
        esc_attr($s['primary']), esc_attr($s['primary_soft']), esc_attr($s['background']), esc_attr($s['surface']), esc_attr($s['text']), esc_attr($s['muted']),
        absint($s['container_width']), absint($s['section_spacing']), absint($s['logo_width']), absint($s['header_height']), $s['sticky_header'] ? 'sticky' : 'relative'
    );
}

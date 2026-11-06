<?php
/**
 * Plugin Name: PinTheme Manager
 * Description: GitHub-backed import, update, conflict detection and rollback manager for PinTheme-generated WordPress themes.
 * Version: 1.0.0
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Author: PINCODE IT
 */
if (!defined('ABSPATH')) exit;

const PINTHEME_MANAGER_VERSION = '1.0.0';
const PINTHEME_DEFAULT_REPOSITORY = 'omarreact/mt4-grey-label-kickgent-next';
const PINTHEME_DEFAULT_BRANCH = 'main';

function pintheme_manager_repo() {
    $repo = (string) get_option('pintheme_repository', PINTHEME_DEFAULT_REPOSITORY);
    return preg_match('/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/', $repo) ? $repo : PINTHEME_DEFAULT_REPOSITORY;
}
function pintheme_manager_branch() {
    $branch = (string) get_option('pintheme_branch', PINTHEME_DEFAULT_BRANCH);
    return preg_match('/^[A-Za-z0-9._\/-]+$/', $branch) && !str_contains($branch, '..') ? $branch : PINTHEME_DEFAULT_BRANCH;
}
function pintheme_manager_raw_url($path) {
    $path = ltrim((string) $path, '/');
    if (!$path || str_contains($path, '..') || !preg_match('/^[A-Za-z0-9._\/-]+$/', $path)) return new WP_Error('pintheme_path', 'Unsafe repository path.');
    return sprintf('https://raw.githubusercontent.com/%s/%s/%s', pintheme_manager_repo(), rawurlencode(pintheme_manager_branch()), $path);
}
function pintheme_manager_get_json($path) {
    $url = pintheme_manager_raw_url($path);
    if (is_wp_error($url)) return $url;
    $response = wp_safe_remote_get($url, ['timeout' => 20, 'redirection' => 2, 'user-agent' => 'PinTheme-Manager/' . PINTHEME_MANAGER_VERSION]);
    if (is_wp_error($response)) return $response;
    if (200 !== wp_remote_retrieve_response_code($response)) return new WP_Error('pintheme_http', 'GitHub package is unavailable.');
    $body = wp_remote_retrieve_body($response);
    if (strlen($body) > 8 * MB_IN_BYTES) return new WP_Error('pintheme_size', 'Remote package is unexpectedly large.');
    $json = json_decode($body, true);
    if (!is_array($json)) return new WP_Error('pintheme_json', 'GitHub package contains invalid JSON.');
    return [$json, $body];
}
function pintheme_manager_state() {
    $manifest_result = pintheme_manager_get_json('pintheme.manifest.json');
    if (is_wp_error($manifest_result)) return $manifest_result;
    [$manifest] = $manifest_result;
    if (($manifest['schemaVersion'] ?? '') !== '1.0' || ($manifest['generator'] ?? '') !== 'pintheme' || empty($manifest['wordpressCompatible'])) return new WP_Error('pintheme_manifest', 'Repository is not a compatible PinTheme package.');
    if (($manifest['repository'] ?? '') !== pintheme_manager_repo() || ($manifest['branch'] ?? '') !== pintheme_manager_branch()) return new WP_Error('pintheme_source', 'Manifest source does not match the configured repository and branch.');
    $feed_path = (string) ($manifest['contentFeed'] ?? '');
    $feed_result = pintheme_manager_get_json($feed_path);
    if (is_wp_error($feed_result)) return $feed_result;
    [$feed, $feed_body] = $feed_result;
    $checksum = hash('sha256', $feed_body);
    if (empty($manifest['contentFeedSha256']) || !hash_equals((string) $manifest['contentFeedSha256'], $checksum)) return new WP_Error('pintheme_checksum', 'Content package checksum verification failed.');
    if (($feed['generator'] ?? '') !== 'pintheme' || !isset($feed['pages']) || !is_array($feed['pages'])) return new WP_Error('pintheme_feed', 'Content feed is incompatible.');
    return [$manifest, $feed];
}
function pintheme_manager_wrapped_content($html) { return "<!-- wp:html -->\n" . (string) $html . "\n<!-- /wp:html -->"; }

function pintheme_manager_backup($feed) {
    $snapshot = ['createdAt' => gmdate('c'), 'show_on_front' => get_option('show_on_front'), 'page_on_front' => (int) get_option('page_on_front'), 'pages' => []];
    foreach ($feed['pages'] as $page) {
        $slug = sanitize_title($page['slug'] ?? '');
        if (!$slug) continue;
        $existing = get_page_by_path($slug, OBJECT, 'page');
        if (!$existing) { $snapshot['pages'][] = ['slug' => $slug, 'missing' => true]; continue; }
        $snapshot['pages'][] = ['slug' => $slug, 'id' => $existing->ID, 'title' => $existing->post_title, 'content' => $existing->post_content, 'status' => $existing->post_status, 'source_commit' => get_post_meta($existing->ID, '_pintheme_source_commit', true), 'source_hash' => get_post_meta($existing->ID, '_pintheme_imported_content_hash', true)];
    }
    $history = (array) get_option('pintheme_backups', []);
    array_unshift($history, $snapshot);
    update_option('pintheme_backups', array_slice($history, 0, 5), false);
}
function pintheme_manager_restore_latest() {
    $history = (array) get_option('pintheme_backups', []);
    if (!$history) return new WP_Error('pintheme_backup', 'No PinTheme backup is available.');
    $snapshot = array_shift($history);
    foreach ((array) ($snapshot['pages'] ?? []) as $page) {
        if (!empty($page['missing'])) {
            $created = get_page_by_path($page['slug'], OBJECT, 'page');
            if ($created) wp_delete_post($created->ID, true);
            continue;
        }
        $id = absint($page['id'] ?? 0);
        if (!$id) continue;
        $result = wp_update_post(wp_slash(['ID' => $id, 'post_title' => $page['title'], 'post_content' => $page['content'], 'post_status' => $page['status']]), true);
        if (is_wp_error($result)) return $result;
        update_post_meta($id, '_pintheme_source_commit', sanitize_text_field($page['source_commit'] ?? ''));
        update_post_meta($id, '_pintheme_imported_content_hash', sanitize_text_field($page['source_hash'] ?? ''));
    }
    update_option('show_on_front', sanitize_key($snapshot['show_on_front'] ?? 'posts'));
    update_option('page_on_front', absint($snapshot['page_on_front'] ?? 0));
    update_option('pintheme_backups', $history, false);
    wp_cache_flush();
    return true;
}
function pintheme_manager_sync_menu($pages_by_slug) {
    $menu_name = 'PinTheme Primary';
    $menu = wp_get_nav_menu_object($menu_name);
    $menu_id = $menu ? (int) $menu->term_id : (int) wp_create_nav_menu($menu_name);
    if (!$menu_id || is_wp_error($menu_id)) return;
    $existing_items = wp_get_nav_menu_items($menu_id) ?: [];
    if ($existing_items) {
        $locations = (array) get_theme_mod('nav_menu_locations', []);
        if (empty($locations['primary'])) $locations['primary'] = $menu_id;
        if (empty($locations['footer'])) $locations['footer'] = $menu_id;
        set_theme_mod('nav_menu_locations', $locations);
        return;
    }
    $home = $pages_by_slug['home'] ?? 0;
    wp_update_nav_menu_item($menu_id, 0, ['menu-item-title' => 'Home', 'menu-item-object-id' => $home, 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-status' => 'publish']);
    $solutions_parent = wp_update_nav_menu_item($menu_id, 0, ['menu-item-title' => 'Solutions', 'menu-item-url' => '#', 'menu-item-type' => 'custom', 'menu-item-status' => 'publish']);
    foreach (['mt4-grey-label','mt5-grey-label','forex-broker-crm','pamm-mam','forex-liquidity-bridge','forex-broker-website'] as $slug) if (!empty($pages_by_slug[$slug])) wp_update_nav_menu_item($menu_id, 0, ['menu-item-title' => get_the_title($pages_by_slug[$slug]), 'menu-item-object-id' => $pages_by_slug[$slug], 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-parent-id' => $solutions_parent, 'menu-item-status' => 'publish']);
    $guides_parent = wp_update_nav_menu_item($menu_id, 0, ['menu-item-title' => 'Guides', 'menu-item-url' => '#', 'menu-item-type' => 'custom', 'menu-item-status' => 'publish']);
    foreach (['how-to-start-forex-brokerage','scale-forex-brokerage','turnkey-grey-label'] as $slug) if (!empty($pages_by_slug[$slug])) wp_update_nav_menu_item($menu_id, 0, ['menu-item-title' => get_the_title($pages_by_slug[$slug]), 'menu-item-object-id' => $pages_by_slug[$slug], 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-parent-id' => $guides_parent, 'menu-item-status' => 'publish']);
    if (!empty($pages_by_slug['about'])) wp_update_nav_menu_item($menu_id, 0, ['menu-item-title' => 'About', 'menu-item-object-id' => $pages_by_slug['about'], 'menu-item-object' => 'page', 'menu-item-type' => 'post_type', 'menu-item-status' => 'publish']);
    $locations = (array) get_theme_mod('nav_menu_locations', []);
    $locations['primary'] = $menu_id;
    $locations['footer'] = $menu_id;
    set_theme_mod('nav_menu_locations', $locations);
}
function pintheme_manager_import($force = false) {
    $state = pintheme_manager_state();
    if (is_wp_error($state)) return $state;
    [$manifest, $feed] = $state;
    pintheme_manager_backup($feed);
    $result = ['created' => 0, 'updated' => 0, 'skipped_local' => 0, 'pages' => []];
    $pages_by_slug = [];
    foreach ($feed['pages'] as $page) {
        $slug = sanitize_title($page['slug'] ?? '');
        if (!$slug) continue;
        $content = pintheme_manager_wrapped_content($page['content'] ?? '');
        $existing = get_page_by_path($slug, OBJECT, 'page');
        if ($existing) {
            $previous_hash = (string) get_post_meta($existing->ID, '_pintheme_imported_content_hash', true);
            $current_hash = hash('sha256', $existing->post_content);
            if (!$force && (!$previous_hash || !hash_equals($previous_hash, $current_hash))) {
                $result['skipped_local']++;
                $pages_by_slug[$slug] = $existing->ID;
                continue;
            }
        }
        $post = ['post_type' => 'page', 'post_status' => 'publish', 'post_title' => sanitize_text_field($page['title'] ?? $slug), 'post_name' => $slug, 'post_content' => $content];
        if ($existing) $post['ID'] = $existing->ID;
        $id = wp_insert_post(wp_slash($post), true);
        if (is_wp_error($id)) return $id;
        update_post_meta($id, '_pintheme_source_commit', sanitize_text_field($manifest['sourceCommit'] ?? ''));
        update_post_meta($id, '_pintheme_imported_content_hash', hash('sha256', $content));
        update_post_meta($id, '_pintheme_source_description', sanitize_text_field($page['description'] ?? ''));
        $pages_by_slug[$slug] = $id;
        $result[$existing ? 'updated' : 'created']++;
        $result['pages'][] = $slug;
    }
    if (!empty($pages_by_slug['home'])) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $pages_by_slug['home']);
    }
    pintheme_manager_sync_menu($pages_by_slug);
    update_option('pintheme_installed_commit', sanitize_text_field($manifest['sourceCommit'] ?? ''), false);
    update_option('pintheme_installed_version', sanitize_text_field($manifest['themeVersion'] ?? ''), false);
    wp_cache_flush();
    return [$manifest, $result];
}

function pintheme_manager_register_settings() {
    register_setting('pintheme_connection', 'pintheme_repository', ['sanitize_callback' => function($value) {
        $value = trim((string) $value);
        return preg_match('/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/', $value) ? $value : PINTHEME_DEFAULT_REPOSITORY;
    }]);
    register_setting('pintheme_connection', 'pintheme_branch', ['sanitize_callback' => function($value) {
        $value = trim((string) $value);
        return preg_match('/^[A-Za-z0-9._\/-]+$/', $value) && !str_contains($value, '..') ? $value : PINTHEME_DEFAULT_BRANCH;
    }]);
}
add_action('admin_init', 'pintheme_manager_register_settings');

function pintheme_manager_menu() {
    add_menu_page('PinTheme Manager', 'PinTheme Manager', 'manage_options', 'pintheme-manager', 'pintheme_manager_dashboard', 'dashicons-admin-appearance', 58);
    add_submenu_page('pintheme-manager', 'Dashboard', 'Dashboard', 'manage_options', 'pintheme-manager', 'pintheme_manager_dashboard');
    add_submenu_page('pintheme-manager', 'GitHub Connection', 'GitHub Connection', 'manage_options', 'pintheme-github', 'pintheme_manager_connection_page');
    add_submenu_page('pintheme-manager', 'Import Website', 'Import Website', 'manage_options', 'pintheme-import', 'pintheme_manager_import_page');
    add_submenu_page('pintheme-manager', 'Updates & Rollback', 'Updates & Rollback', 'manage_options', 'pintheme-updates', 'pintheme_manager_updates_page');
    add_submenu_page('pintheme-manager', 'System Status', 'System Status', 'manage_options', 'pintheme-status', 'pintheme_manager_status_page');
}
add_action('admin_menu', 'pintheme_manager_menu');

function pintheme_manager_notice($message, $error = false) {
    echo '<div class="notice ' . ($error ? 'notice-error' : 'notice-success') . '"><p>' . esc_html($message) . '</p></div>';
}
function pintheme_manager_dashboard() {
    if (!current_user_can('manage_options')) return;
    $state = pintheme_manager_state();
    echo '<div class="wrap"><h1>PinTheme Manager</h1><p>Manage the reviewed GitHub → WordPress production workflow without requiring Next.js on this server.</p>';
    echo '<table class="widefat striped" style="max-width:900px"><tbody><tr><th>Repository</th><td>' . esc_html(pintheme_manager_repo()) . '</td></tr><tr><th>Branch</th><td>' . esc_html(pintheme_manager_branch()) . '</td></tr><tr><th>Installed commit</th><td><code>' . esc_html(get_option('pintheme_installed_commit', 'Not imported yet')) . '</code></td></tr>';
    if (is_wp_error($state)) echo '<tr><th>Remote status</th><td>' . esc_html($state->get_error_message()) . '</td></tr>';
    else echo '<tr><th>Available</th><td>v' . esc_html($state[0]['themeVersion']) . ' · <code>' . esc_html($state[0]['sourceCommit']) . '</code> · ' . absint($state[0]['pageCount']) . ' pages</td></tr>';
    echo '</tbody></table><p><a class="button button-primary" href="' . esc_url(admin_url('admin.php?page=pintheme-import')) . '">Review import</a> <a class="button" href="' . esc_url(admin_url('themes.php?page=pintheme-settings')) . '">Theme settings</a></p></div>';
}
function pintheme_manager_connection_page() {
    if (!current_user_can('manage_options')) return;
    echo '<div class="wrap"><h1>GitHub Connection</h1><p>This proof of concept uses validated public GitHub packages and stores no access token. Private-repository GitHub App/OAuth support is intentionally not enabled yet.</p><form method="post" action="options.php">';
    settings_fields('pintheme_connection');
    echo '<table class="form-table"><tr><th><label for="pt-repo">Repository</label></th><td><input id="pt-repo" class="regular-text" name="pintheme_repository" value="' . esc_attr(pintheme_manager_repo()) . '"></td></tr><tr><th><label for="pt-branch">Branch</label></th><td><input id="pt-branch" class="regular-text" name="pintheme_branch" value="' . esc_attr(pintheme_manager_branch()) . '"></td></tr></table>';
    submit_button('Save connection');
    echo '</form></div>';
}
function pintheme_manager_import_page() {
    if (!current_user_can('manage_options')) return;
    if (isset($_POST['pintheme_import'])) {
        check_admin_referer('pintheme_import');
        $force = !empty($_POST['force_replace']);
        $import = pintheme_manager_import($force);
        if (is_wp_error($import)) pintheme_manager_notice($import->get_error_message(), true);
        else pintheme_manager_notice(sprintf('Import complete: %d created, %d updated, %d preserved because of local edits.', $import[1]['created'], $import[1]['updated'], $import[1]['skipped_local']));
    }
    $state = pintheme_manager_state();
    echo '<div class="wrap"><h1>Import Website</h1>';
    if (is_wp_error($state)) {
        pintheme_manager_notice($state->get_error_message(), true);
        echo '</div>';
        return;
    }
    [$manifest, $feed] = $state;
    echo '<p><strong>Available:</strong> v' . esc_html($manifest['themeVersion']) . ' · <code>' . esc_html($manifest['sourceCommit']) . '</code></p><p><strong>Pages:</strong> ' . absint(count($feed['pages'])) . '</p><ol>';
    foreach ($feed['pages'] as $page) echo '<li>' . esc_html($page['title'] ?? $page['slug']) . ' <code>/' . esc_html($page['slug']) . '/</code></li>';
    echo '</ol><form method="post">';
    wp_nonce_field('pintheme_import');
    echo '<label><input type="checkbox" name="force_replace" value="1"> Replace pages with local edits (destructive)</label><p class="description">Unchecked is the safe default: locally modified WordPress pages are preserved.</p>';
    submit_button('Import reviewed GitHub version', 'primary', 'pintheme_import');
    echo '</form></div>';
}
function pintheme_manager_updates_page() {
    if (!current_user_can('manage_options')) return;
    if (isset($_POST['pintheme_rollback'])) {
        check_admin_referer('pintheme_rollback');
        $result = pintheme_manager_restore_latest();
        pintheme_manager_notice(is_wp_error($result) ? $result->get_error_message() : 'Latest PinTheme content snapshot restored.', is_wp_error($result));
    }
    $history = (array) get_option('pintheme_backups', []);
    echo '<div class="wrap"><h1>Updates & Rollback</h1><p>Theme code updates and content imports remain separate. Content is not replaced unless an administrator runs an import.</p><p>Stored content snapshots: <strong>' . absint(count($history)) . '</strong> (maximum 5).</p>';
    if ($history) {
        echo '<form method="post">';
        wp_nonce_field('pintheme_rollback');
        submit_button('Restore latest content snapshot', 'secondary', 'pintheme_rollback');
        echo '</form>';
    }
    echo '</div>';
}
function pintheme_manager_status_page() {
    if (!current_user_can('manage_options')) return;
    $state = pintheme_manager_state();
    $theme = wp_get_theme();
    echo '<div class="wrap"><h1>System Status</h1><table class="widefat striped" style="max-width:900px"><tbody>';
    foreach ([['WordPress', get_bloginfo('version')], ['PHP', PHP_VERSION], ['Active theme', $theme->get('Name') . ' ' . $theme->get('Version')], ['HTTPS', is_ssl() ? 'Yes' : 'No'], ['GitHub package', is_wp_error($state) ? $state->get_error_message() : 'Validated'], ['Checksum', is_wp_error($state) ? 'Unavailable' : 'SHA-256 verified']] as $row) echo '<tr><th>' . esc_html($row[0]) . '</th><td>' . esc_html($row[1]) . '</td></tr>';
    echo '</tbody></table></div>';
}

<?php
/**
 * Plugin Name: Holmes Public Site
 * Description: Holmes High School's public kiosk pages, backed by Holmes Content Portal records.
 * Version: 1.0.0
 * Requires at least: 6.6
 * Requires PHP: 7.4
 * Author: Empire Digital Signs
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Holmes_Public_Site {
    const VERSION = '1.0.0';

    private static function pages() {
        return array(
            'home' => array('title' => 'Holmes High School', 'path' => 'home', 'parent' => ''),
            'history' => array('title' => 'History', 'path' => 'history', 'parent' => ''),
            'academics' => array('title' => 'Academics', 'path' => 'academics', 'parent' => ''),
            'academic-programs' => array('title' => 'Academic Programs', 'path' => 'academic-programs', 'parent' => 'academics'),
            'career-and-technical-education' => array('title' => 'Career and Technical Education', 'path' => 'career-and-technical-education', 'parent' => 'academics'),
            'hall-of-distinction' => array('title' => 'Hall of Distinction', 'path' => 'hall-of-distinction', 'parent' => 'academics'),
            'athletics' => array('title' => 'Athletics', 'path' => 'athletics', 'parent' => ''),
            'hall-of-fame' => array('title' => 'Hall of Fame', 'path' => 'hall-of-fame', 'parent' => 'athletics'),
            'championship' => array('title' => 'Championship', 'path' => 'championship', 'parent' => 'athletics'),
            'timeline' => array('title' => 'Timeline', 'path' => 'timeline', 'parent' => 'athletics'),
            'yearbooks' => array('title' => 'Yearbooks', 'path' => 'yearbooks', 'parent' => ''),
        );
    }

    public static function boot() {
        add_shortcode('holmes_public_site', array(__CLASS__, 'render_app'));
        add_filter('template_include', array(__CLASS__, 'template'));
        add_action('wp_enqueue_scripts', array(__CLASS__, 'enqueue_page_assets'));
        add_action('init', array(__CLASS__, 'ensure_pages'));
    }

    public static function activate() {
        self::ensure_pages();
        $pages = get_option('holmes_public_site_pages', array());
        $home_id = isset($pages['home']) ? absint($pages['home']) : 0;

        // A fresh WordPress install defaults to the posts page; point it at the kiosk home.
        if ($home_id && get_option('show_on_front') === 'posts' && !get_option('page_on_front')) {
            update_option('show_on_front', 'page');
            update_option('page_on_front', $home_id);
        }
        flush_rewrite_rules();
    }

    public static function ensure_pages() {
        $saved = get_option('holmes_public_site_pages', array());
        $page_ids = is_array($saved) ? $saved : array();

        foreach (self::pages() as $key => $definition) {
            if (!empty($page_ids[$key]) && get_post((int) $page_ids[$key])) {
                continue;
            }
            $parent_id = $definition['parent'] && !empty($page_ids[$definition['parent']])
                ? (int) $page_ids[$definition['parent']]
                : 0;
            $path = $parent_id
                ? trim(get_page_uri($parent_id) . '/' . $definition['path'], '/')
                : $definition['path'];
            $existing = get_page_by_path($path, OBJECT, 'page');

            if ($existing) {
                if (has_shortcode($existing->post_content, 'holmes_public_site')) {
                    $page_ids[$key] = (int) $existing->ID;
                }
                continue;
            }

            $page_id = wp_insert_post(array(
                'post_type' => 'page',
                'post_status' => 'publish',
                'post_title' => $definition['title'],
                'post_name' => $definition['path'],
                'post_parent' => $parent_id,
                'post_content' => '[holmes_public_site page="' . esc_attr($key) . '"]',
            ), true);
            if (is_wp_error($page_id)) {
                error_log('Holmes Public Site: failed to create the ' . $key . ' page: ' . $page_id->get_error_message());
                continue;
            }
            $page_ids[$key] = (int) $page_id;
        }

        update_option('holmes_public_site_pages', $page_ids);
    }

    public static function render_app($attributes) {
        $attributes = shortcode_atts(array('page' => 'home'), $attributes, 'holmes_public_site');
        $page = sanitize_key($attributes['page']);
        if (!isset(self::pages()[$page])) {
            return '<p role="alert">' . esc_html__('This Holmes page is not available.', 'holmes-public-site') . '</p>';
        }

        if (!is_readable(plugin_dir_path(__FILE__) . 'build/index.asset.php')) {
            return '<p role="alert">' . esc_html__('Holmes Public Site assets are missing. Run npm run build and upload the rebuilt plugin.', 'holmes-public-site') . '</p>';
        }

        $routes = self::route_urls();
        return '<div id="holmes-public-site" data-page="' . esc_attr($page) . '" data-routes="' . esc_attr(wp_json_encode($routes)) . '" data-api-root="' . esc_url(rest_url('holmes/v1/public/')) . '" data-assets="' . esc_url(plugins_url('assets/', __FILE__)) . '"></div>';
    }

    public static function template($template) {
        if (!is_page()) {
            return $template;
        }
        $post = get_post();
        if ($post && has_shortcode($post->post_content, 'holmes_public_site')) {
            return plugin_dir_path(__FILE__) . 'template.php';
        }
        return $template;
    }

    public static function enqueue_page_assets() {
        if (!is_page()) {
            return;
        }
        $post = get_post();
        if (!$post || !has_shortcode($post->post_content, 'holmes_public_site')) {
            return;
        }
        $asset_file = plugin_dir_path(__FILE__) . 'build/index.asset.php';
        if (!is_readable($asset_file)) {
            return;
        }
        $asset = require $asset_file;
        wp_enqueue_script(
            'holmes-public-site',
            plugins_url('build/index.js', __FILE__),
            $asset['dependencies'],
            $asset['version'],
            true
        );
        if (is_readable(plugin_dir_path(__FILE__) . 'build/style-index.css')) {
            wp_enqueue_style(
                'holmes-public-site',
                plugins_url('build/style-index.css', __FILE__),
                array(),
                $asset['version']
            );
        }
    }

    private static function route_urls() {
        $page_ids = get_option('holmes_public_site_pages', array());
        $routes = array();
        foreach (self::pages() as $key => $definition) {
            $page_id = isset($page_ids[$key]) ? (int) $page_ids[$key] : 0;
            $routes[$key] = $page_id ? get_permalink($page_id) : home_url('/' . $definition['path'] . '/');
        }
        if (!empty($page_ids['home']) && (int) get_option('page_on_front') === (int) $page_ids['home']) {
            $routes['home'] = home_url('/');
        }
        return $routes;
    }
}

Holmes_Public_Site::boot();
register_activation_hook(__FILE__, array('Holmes_Public_Site', 'activate'));

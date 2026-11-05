<?php
/**
 * Plugin Name: Holmes Content Portal
 * Description: WordPress-managed content and role-protected editing tools for Holmes High School.
 * Version: 1.0.0
 * Requires at least: 6.6
 * Requires PHP: 7.4
 * Author: Empire Digital Signs
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Holmes_Content_Portal {
    const VERSION = '1.0.0';

    private static function types() {
        return array(
            'hhs_program' => array('label' => 'Academic Programs', 'plural' => 'Academic Programs', 'cap' => 'hhs_program', 'rest' => 'hhs-programs'),
            'hhs_cte' => array('label' => 'Career and Technical Education', 'plural' => 'Career and Technical Education', 'cap' => 'hhs_cte', 'rest' => 'hhs-cte-programs'),
            'hhs_hod' => array('label' => 'Hall of Distinction Inductees', 'plural' => 'Hall of Distinction Inductees', 'cap' => 'hhs_hod', 'rest' => 'hhs-hod-inductees'),
            'hhs_hof' => array('label' => 'Hall of Fame Inductees', 'plural' => 'Hall of Fame Inductees', 'cap' => 'hhs_hof', 'rest' => 'hhs-hof-inductees'),
            'hhs_championship' => array('label' => 'Championships', 'plural' => 'Championships', 'cap' => 'hhs_championship', 'rest' => 'hhs-championships'),
            'hhs_history' => array('label' => 'History Entries', 'plural' => 'History Entries', 'cap' => 'hhs_history', 'rest' => 'hhs-history'),
            'hhs_timeline' => array('label' => 'Athletics Timeline', 'plural' => 'Athletics Timeline', 'cap' => 'hhs_timeline', 'rest' => 'hhs-timeline'),
            'hhs_slide' => array('label' => 'Homepage Slides', 'plural' => 'Homepage Slides', 'cap' => 'hhs_slide', 'rest' => 'hhs-slides'),
            'hhs_yearbook' => array('label' => 'Yearbooks', 'plural' => 'Yearbooks', 'cap' => 'hhs_yearbook', 'rest' => 'hhs-yearbooks'),
        );
    }

    private static function meta_fields() {
        return array(
            'hhs_program' => array('images' => 'array'),
            'hhs_cte' => array('images' => 'array'),
            'hhs_hod' => array('firstName' => 'string', 'lastName' => 'string', 'inductionYear' => 'integer'),
            'hhs_hof' => array('firstName' => 'string', 'lastName' => 'string', 'inductionYear' => 'integer'),
            'hhs_championship' => array('sport' => 'string', 'year' => 'integer'),
            'hhs_history' => array('year' => 'integer'),
            'hhs_timeline' => array('year' => 'integer'),
            'hhs_slide' => array('startDate' => 'string', 'endDate' => 'string', 'duration' => 'number'),
            'hhs_yearbook' => array('year' => 'integer', 'url' => 'string'),
        );
    }

    public static function boot() {
        add_action('init', array(__CLASS__, 'register_post_types'));
        add_action('init', array(__CLASS__, 'register_meta'));
        add_action('rest_api_init', array(__CLASS__, 'register_api'));
        add_action('admin_menu', array(__CLASS__, 'register_admin_page'));
        add_action('admin_enqueue_scripts', array(__CLASS__, 'enqueue_admin_assets'));

        foreach (array_keys(self::types()) as $post_type) {
            add_filter('rest_pre_insert_' . $post_type, function ($prepared_post, $request) use ($post_type) {
                return self::validate_record($prepared_post, $request, $post_type);
            }, 10, 2);
        }
    }

    public static function activate() {
        self::grant_role_capabilities();
        self::register_post_types();
        self::register_meta();
        self::seed_yearbooks();
    }

    public static function register_post_types() {
        foreach (self::types() as $post_type => $definition) {
            $singular = $definition['cap'];
            $plural = $singular . 's';
            register_post_type($post_type, array(
                'labels' => array(
                    'name' => $definition['plural'],
                    'singular_name' => $definition['label'],
                ),
                'public' => true,
                'publicly_queryable' => false,
                'exclude_from_search' => true,
                'has_archive' => false,
                'rewrite' => false,
                'show_ui' => false,
                'show_in_rest' => true,
                'rest_base' => $definition['rest'],
                'supports' => array('title', 'editor', 'thumbnail', 'revisions', 'custom-fields'),
                'capability_type' => array($singular, $plural),
                'map_meta_cap' => true,
            ));
        }
    }

    public static function register_meta() {
        foreach (self::meta_fields() as $post_type => $fields) {
            $definition = self::types()[$post_type];
            $plural_cap = $definition['cap'] . 's';

            foreach ($fields as $key => $type) {
                $schema = array('type' => $type);
                if ($type === 'array') {
                    $schema['items'] = array('type' => 'integer');
                }

                register_post_meta($post_type, $key, array(
                    'single' => true,
                    'type' => $type,
                    'show_in_rest' => array('schema' => $schema),
                    'auth_callback' => function ($allowed, $meta_key, $post_id) use ($plural_cap) {
                        return $post_id
                            ? current_user_can('edit_post', $post_id)
                            : current_user_can('edit_' . $plural_cap);
                    },
                    'sanitize_callback' => $type === 'array'
                        ? array(__CLASS__, 'sanitize_media_ids')
                        : null,
                ));
            }
        }
    }

    public static function sanitize_media_ids($value) {
        if (!is_array($value)) {
            return array();
        }
        return array_values(array_filter(array_map('absint', $value)));
    }

    public static function register_api() {
        register_rest_route('holmes/v1', '/public/(?P<type>academic-programs|career-and-technical-education|hall-of-distinction|hall-of-fame|championships|history|timeline|slides|yearbooks)', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array(__CLASS__, 'public_content'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('holmes/v1', '/slideshow-settings', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array(__CLASS__, 'get_slideshow_settings'),
                'permission_callback' => function () {
                    return current_user_can('edit_hhs_slides');
                },
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array(__CLASS__, 'save_slideshow_settings'),
                'permission_callback' => function () {
                    return current_user_can('edit_hhs_slides');
                },
                'args' => array(
                    'transitionDuration' => array(
                        'required' => true,
                        'validate_callback' => function ($value) {
                            return is_numeric($value) && (float) $value >= 0 && (float) $value <= 60;
                        },
                    ),
                ),
            ),
        ));
    }

    public static function public_content($request) {
        $type_map = array(
            'academic-programs' => 'hhs_program',
            'career-and-technical-education' => 'hhs_cte',
            'hall-of-distinction' => 'hhs_hod',
            'hall-of-fame' => 'hhs_hof',
            'championships' => 'hhs_championship',
            'history' => 'hhs_history',
            'timeline' => 'hhs_timeline',
            'slides' => 'hhs_slide',
            'yearbooks' => 'hhs_yearbook',
        );
        $route_type = $request->get_param('type');
        $post_type = isset($type_map[$route_type]) ? $type_map[$route_type] : '';
        if (!$post_type) {
            return new WP_Error('holmes_invalid_content_type', 'The requested content type is unavailable.', array('status' => 404));
        }

        // The public API returns only published records and a deliberately narrow field set.
        $posts = get_posts(array(
            'post_type' => $post_type,
            'post_status' => 'publish',
            'numberposts' => -1,
            'orderby' => 'title',
            'order' => 'ASC',
        ));
        $records = array_map(function ($post) use ($post_type) {
            return self::serialize_public_record($post, $post_type);
        }, $posts);

        if ($route_type === 'slides') {
            return rest_ensure_response(array(
                'slides' => $records,
                'transitionDuration' => (float) get_option('hhs_slideshow_transition_duration', 2),
            ));
        }
        return rest_ensure_response($records);
    }

    private static function serialize_public_record($post, $post_type) {
        $featured_id = get_post_thumbnail_id($post);
        $images = get_post_meta($post->ID, 'images', true);
        $image_urls = array();
        if (is_array($images)) {
            foreach (self::sanitize_media_ids($images) as $image_id) {
                $image_url = wp_get_attachment_image_url($image_id, 'full');
                if ($image_url) {
                    $image_urls[] = $image_url;
                }
            }
        }

        $record = array(
            'id' => (int) $post->ID,
            'title' => get_the_title($post),
            'firstName' => (string) get_post_meta($post->ID, 'firstName', true),
            'lastName' => (string) get_post_meta($post->ID, 'lastName', true),
            'inductionYear' => (int) get_post_meta($post->ID, 'inductionYear', true),
            'year' => (int) get_post_meta($post->ID, 'year', true),
            'sport' => (string) get_post_meta($post->ID, 'sport', true),
            'description' => wp_strip_all_tags($post->post_content),
            'image' => $featured_id ? wp_get_attachment_image_url($featured_id, 'full') : '',
            'images' => $image_urls,
            'startDate' => (string) get_post_meta($post->ID, 'startDate', true),
            'endDate' => (string) get_post_meta($post->ID, 'endDate', true),
            'duration' => (float) get_post_meta($post->ID, 'duration', true),
            'url' => esc_url_raw((string) get_post_meta($post->ID, 'url', true)),
        );
        if ($post_type === 'hhs_yearbook') {
            return array(
                'id' => (int) $post->ID,
                'year' => (int) get_post_meta($post->ID, 'year', true),
                'url' => esc_url_raw((string) get_post_meta($post->ID, 'url', true)),
            );
        }
        return $record;
    }

    public static function get_slideshow_settings() {
        return rest_ensure_response(array(
            'transitionDuration' => (float) get_option('hhs_slideshow_transition_duration', 2),
        ));
    }

    public static function save_slideshow_settings($request) {
        $duration = $request->get_param('transitionDuration');
        if (!is_numeric($duration) || (float) $duration < 0 || (float) $duration > 60) {
            return new WP_Error('holmes_invalid_transition_duration', 'Transition duration must be between 0 and 60 seconds.', array('status' => 400));
        }
        update_option('hhs_slideshow_transition_duration', (float) $duration);
        return rest_ensure_response(array('transitionDuration' => (float) $duration));
    }

    public static function register_admin_page() {
        add_menu_page(
            'Holmes Content Portal',
            'Holmes Content',
            'edit_hhs_programs',
            'holmes-content',
            array(__CLASS__, 'render_admin_page'),
            'dashicons-welcome-learn-more',
            3
        );
    }

    public static function render_admin_page() {
        if (!current_user_can('edit_hhs_programs')) {
            wp_die(esc_html__('You do not have permission to manage Holmes content.', 'holmes-content'));
        }
        echo '<div class="wrap"><div id="holmes-content-portal"></div></div>';
    }

    public static function enqueue_admin_assets($hook) {
        if ($hook !== 'toplevel_page_holmes-content') {
            return;
        }

        wp_enqueue_media();
        $asset_file = plugin_dir_path(__FILE__) . 'build/index.asset.php';
        if (!is_readable($asset_file)) {
            add_action('admin_notices', function () {
                echo '<div class="notice notice-error"><p>' . esc_html__('Holmes Content Portal assets are missing. Run npm run build in the project and upload the rebuilt plugin.', 'holmes-content') . '</p></div>';
            });
            return;
        }
        $asset = require $asset_file;
        wp_enqueue_script(
            'holmes-content-portal',
            plugins_url('build/index.js', __FILE__),
            $asset['dependencies'],
            $asset['version'],
            true
        );
        if (is_readable(plugin_dir_path(__FILE__) . 'build/style-index.css')) {
            wp_enqueue_style(
                'holmes-content-portal',
                plugins_url('build/style-index.css', __FILE__),
                array(),
                $asset['version']
            );
        }
        wp_localize_script('holmes-content-portal', 'HolmesContentPortal', array(
            'apiRoot' => esc_url_raw(rest_url('wp/v2/')),
            'customApiRoot' => esc_url_raw(rest_url('holmes/v1/')),
            'nonce' => wp_create_nonce('wp_rest'),
            'canEditYearbooks' => current_user_can('edit_hhs_yearbooks'),
            'profileUrl' => esc_url(admin_url('profile.php')),
        ));
    }

    private static function validate_record($prepared_post, $request, $post_type) {
        $title = $request->get_param('title');
        $meta = $request->get_param('meta');
        $meta = is_array($meta) ? $meta : array();
        $existing_id = absint($request->get_param('id'));
        $featured_id = absint($request->get_param('featured_media'));
        if (!$featured_id && $existing_id) {
            $featured_id = get_post_thumbnail_id($existing_id);
        }
        $required = array(
            'hhs_hod' => array('firstName', 'lastName', 'inductionYear'),
            'hhs_hof' => array('firstName', 'lastName', 'inductionYear'),
            'hhs_championship' => array('sport', 'year'),
            'hhs_history' => array('year'),
            'hhs_timeline' => array('year'),
            'hhs_yearbook' => array('year', 'url'),
        );

        if ($post_type === 'hhs_yearbook') {
            $year = isset($meta['year']) ? absint($meta['year']) : ($existing_id ? absint(get_post_meta($existing_id, 'year', true)) : 0);
            if ($year && is_object($prepared_post)) {
                $prepared_post->post_title = (string) $year;
            }
        } elseif (!is_string($title) || trim(wp_strip_all_tags($title)) === '') {
            return new WP_Error('holmes_title_required', 'A title is required.', array('status' => 400));
        }
        foreach (isset($required[$post_type]) ? $required[$post_type] : array() as $key) {
            $value = isset($meta[$key]) ? $meta[$key] : ($existing_id ? get_post_meta($existing_id, $key, true) : '');
            if (
                $value === '' ||
                $value === null ||
                (is_string($value) && trim($value) === '') ||
                (in_array($key, array('year', 'inductionYear'), true) && absint($value) < 1)
            ) {
                return new WP_Error('holmes_required_field', sprintf('%s is required.', $key), array('status' => 400));
            }
        }
        if (in_array($post_type, array('hhs_hod', 'hhs_hof', 'hhs_championship'), true) && !$featured_id) {
            return new WP_Error('holmes_image_required', 'An image is required for this record.', array('status' => 400));
        }
        if ($post_type === 'hhs_yearbook') {
            $url = isset($meta['url']) ? $meta['url'] : ($existing_id ? get_post_meta($existing_id, 'url', true) : '');
            if (!wp_http_validate_url($url)) {
                return new WP_Error('holmes_yearbook_url_invalid', 'Yearbook URL must be a valid HTTP or HTTPS address.', array('status' => 400));
            }
        }
        return $prepared_post;
    }

    private static function grant_role_capabilities() {
        foreach (array('editor', 'administrator') as $role_name) {
            $role = get_role($role_name);
            if (!$role) {
                continue;
            }
            foreach (self::types() as $definition) {
                // Editors manage site content; yearbook permissions remain administrator-only.
                if ($role_name === 'editor' && $definition['cap'] === 'hhs_yearbook') {
                    continue;
                }
                $singular = $definition['cap'];
                $plural = $singular . 's';
                $caps = array(
                    'edit_' . $singular,
                    'read_' . $singular,
                    'delete_' . $singular,
                    'edit_' . $plural,
                    'edit_others_' . $plural,
                    'publish_' . $plural,
                    'read_private_' . $plural,
                    'delete_' . $plural,
                    'delete_private_' . $plural,
                    'delete_published_' . $plural,
                    'delete_others_' . $plural,
                    'edit_private_' . $plural,
                    'edit_published_' . $plural,
                );
                foreach ($caps as $capability) {
                    $role->add_cap($capability);
                }
            }
        }
    }

    private static function seed_yearbooks() {
        $defaults_path = plugin_dir_path(__FILE__) . 'yearbook-defaults.json';
        if (!is_readable($defaults_path)) {
            error_log('Holmes Content Portal: yearbook-defaults.json is missing; existing yearbooks were not seeded.');
            return;
        }
        $defaults = json_decode(file_get_contents($defaults_path), true);
        if (!is_array($defaults)) {
            error_log('Holmes Content Portal: yearbook-defaults.json is invalid JSON; existing yearbooks were not seeded.');
            return;
        }

        foreach ($defaults as $yearbook) {
            $year = isset($yearbook['year']) ? absint($yearbook['year']) : 0;
            $url = isset($yearbook['url']) ? esc_url_raw($yearbook['url']) : '';
            if (!$year || !wp_http_validate_url($url)) {
                continue;
            }
            $existing = get_posts(array(
                'post_type' => 'hhs_yearbook',
                'post_status' => array('publish', 'draft', 'pending', 'private'),
                'numberposts' => 1,
                'meta_key' => 'year',
                'meta_value' => $year,
            ));
            if ($existing) {
                continue;
            }
            $post_id = wp_insert_post(array(
                'post_type' => 'hhs_yearbook',
                'post_status' => 'publish',
                'post_title' => (string) $year,
                'post_content' => '',
            ), true);
            if (is_wp_error($post_id)) {
                error_log('Holmes Content Portal: failed to seed yearbook ' . $year . ': ' . $post_id->get_error_message());
                continue;
            }
            update_post_meta($post_id, 'year', $year);
            update_post_meta($post_id, 'url', $url);
        }
    }
}

Holmes_Content_Portal::boot();
register_activation_hook(__FILE__, array('Holmes_Content_Portal', 'activate'));

<?php
if (!defined('ABSPATH')) {
    exit;
}
$page = get_post();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class('holmes-kiosk-page'); ?>>
<?php wp_body_open(); ?>
<main id="holmes-kiosk-main">
    <?php echo $page ? do_shortcode($page->post_content) : ''; ?>
</main>
<?php wp_footer(); ?>
</body>
</html>

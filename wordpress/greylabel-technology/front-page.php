<?php get_header(); ?>
<main id="main" class="pintheme-main">
<?php if (have_posts()): while (have_posts()): the_post(); the_content(); endwhile; else: ?>
<section class="pintheme-empty"><div class="pintheme-shell"><h1><?php esc_html_e('GreyLabel Technology', 'greylabel-technology'); ?></h1><p><?php esc_html_e('Activate PinTheme Manager and import the reviewed website content package.', 'greylabel-technology'); ?></p></div></section>
<?php endif; ?>
</main>
<?php get_footer(); ?>

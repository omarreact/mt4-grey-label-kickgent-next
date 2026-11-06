<?php get_header(); ?>
<main id="main" class="pintheme-main">
<?php if (have_posts()): while (have_posts()): the_post(); the_content(); endwhile; else: ?><section class="pintheme-empty"><div class="pintheme-shell"><h1><?php esc_html_e('Kickgent GreyLabel', 'kickgent-pintheme'); ?></h1><p><?php esc_html_e('Install and activate PinTheme Manager, then import the reviewed GitHub website package.', 'kickgent-pintheme'); ?></p></div></section><?php endif; ?>
</main>
<?php get_footer(); ?>

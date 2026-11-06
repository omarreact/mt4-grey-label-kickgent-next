<?php get_header(); ?>
<main id="main" class="pintheme-content"><div class="pintheme-shell"><h1><?php the_archive_title(); ?></h1><?php if (have_posts()): while (have_posts()): the_post(); ?><article <?php post_class(); ?>><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article><?php endwhile; the_posts_pagination(); else: ?><p><?php esc_html_e('No content found.', 'greylabel-technology'); ?></p><?php endif; ?></div></main>
<?php get_footer(); ?>

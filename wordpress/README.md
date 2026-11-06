# WordPress sync deployment

Next.js main is canonical. A source update regenerates the WordPress feed, WXR and theme/plugin ZIP artifact.

1. Download the kickgent-wordpress-sync-package GitHub Actions artifact.
2. Install the theme and plugin ZIPs in WordPress.
3. Open Tools > Kickgent GitHub Sync, review the available commit, then import it.

The importer updates pages by slug and sets home as the front page. It verifies the Git blob SHA. WordPress edits to synced pages are replaced by the next import.

This is source synchronization. Imported page bodies use Custom HTML blocks for parity; per-section drag-and-drop Gutenberg editing requires a later native-block migration.

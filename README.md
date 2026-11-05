# Holmes High School WordPress Plugins

This repository builds two coordinated WordPress plugins:

- `wordpress/holmes-content-portal` stores records, exposes the public content API, and provides a role-protected editor in the WordPress dashboard.
- `wordpress/holmes-public-site` renders the Holmes kiosk pages and reads published records from Holmes Content Portal.

The public pages retain the existing public-site/Tailwind presentation. The reference plugins in `WORDPRESS REFERENCE` were used for functional ideas only; their visual design is not part of this implementation.

## Build

Requirements: Node.js 20.10 or later, WordPress 6.6 or later, and PHP 7.4 or later.

```sh
npm ci
npm run build
```

The build outputs are written to each plugin's `build/` directory. Copy both plugin directories, including their `build/` directories and assets, into `wp-content/plugins/`, then activate **Holmes Content Portal** before **Holmes Public Site**.

## Source structure

The plugin application sources use TypeScript and TSX. `@wordpress/scripts` compiles them to the JavaScript bundles WordPress enqueues; TypeScript does not run in WordPress. Each plugin's `src/index.tsx` is only a bootstrap. A single `index.js` was an initial conversion convenience, not a WordPress requirement: `@wordpress/scripts` bundles imported modules into the same enqueued asset. The public site keeps shared components, data access, constants, and individual page modules in separate files; the content portal keeps its shared CRUD interface, editor controls, constants, and REST/media helpers separate. The coverflow carousel remains a standalone TSX component.

Run `npm run lint` to lint every TypeScript source module before building.

## WordPress setup

- Editors and Administrators can manage programs, inductees, championships, history, timeline entries, and homepage slides from **Holmes Content** in the dashboard.
- Only Administrators can manage yearbooks. The portal hides the yearbook editor from other roles, and the WordPress post-type capabilities enforce the same restriction on write requests.
- The content portal provides light/dark appearance modes and a support link to `support@empiredigitalsigns.com`.
- The portal uses WordPress's standard login/session flow. Site-level SSO/MFA integrations can continue to use their normal WordPress login hooks.
- Activating Holmes Content Portal seeds the current hard-coded yearbook links as WordPress records. Legacy CMS records are not imported.
- Activating Holmes Public Site creates the pages for the kiosk routes when those slugs are available. On a fresh site it sets the generated Home page as the front page. Existing pages are not overwritten; if a route conflicts, add the corresponding shortcode, for example `[holmes_public_site page="history"]`, to the page you want the plugin to render.
- Homepage slides and history/timeline entries retain the existing public site's content structure. New programs, inductees, and championships use the WordPress content fields described in the editor.

## Content model

| Content | Fields |
| --- | --- |
| Academic Programs / Career and Technical Education | Name, image slideshow, description |
| Hall of Distinction / Hall of Fame | First name, last name, bio, induction year, image |
| Championships | Sport, championship name, year, description, image |
| History | Title, year, description, optional photo |
| Athletics Timeline | Title, year, description |
| Homepage slideshow | Slide image, name, start/end dates, duration; transition duration |
| Yearbooks | Year, URL; Administrators only |

The public plugin includes the program description/slideshow popup, sport-grouped championship list and detail popup, historical timeline/history views, halls, navigation, idle return behavior, and yearbook viewer. Its Tailwind and component styles are scoped to the kiosk app container, so the active WordPress theme does not restyle the app or receive the kiosk's global CSS.

The content portal's custom post types expose registered metadata through the WordPress REST API. Keep `custom-fields` support enabled on those post types so values such as years, slideshow durations, sports, inductee names, and program image IDs can be saved and read by the editor.

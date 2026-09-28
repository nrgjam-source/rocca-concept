# ROCCA

Static homepage for the existing `rocca-concept-standalone` Vercel project.
Production: https://rocca-concept-standalone.vercel.app/

## Editing

- `index.html`: page content and semantic sections; no bundled/base64 images.
- `assets/css/main.css`: layout, responsive breakpoints, reduced-motion fallback.
- `assets/js/main.js`: mobile navigation, accessible process tabs, viewport-driven motion.
- `assets/main1–main7.webp`: optimized source images; `-800` variants for smaller screens.
- Serve locally with `python3 -m http.server 3000`. No build or dependencies required.

## Images

| Image | Placement |
| --- | --- |
| main1 | Entrance groups |
| main2 | Staircases |
| main3 | Materials |
| main4 | Project directions overview |
| main5 | Hero, eager loading and high fetch priority |
| main6 | Closing architectural scene |
| main8 | Engineering (one use) |
| main9 | Audiences (one use) |

Images below the hero use lazy loading. Replace each project article independently as real cases become available. Current imagery is labelled as conceptual directions, not completed ROCCA projects.

## Pending content

- Real case photographs, descriptions, credits and publication permissions.
- Telephone and Telegram/WhatsApp links for Evgeniy and Olga.
- Confirm operational ownership of `hello@roccastone.ru` (retained from the previous site).
- Journal articles; current cards are announced future topics, not published links.
- Real production photographs and company details.

The project directions CTA expands an honest portfolio notice while actual cases are pending. Contact CTA opens email; there is no unconnected form or simulated submission.

Future material entries should use independent `material`, `application`, and `originCountry` fields. The materials section is application-led; these fields can power future filters without making country the primary navigation. Do not add nonfunctional filters before that content exists.

## Deployment

Commit and push to existing `main`; Vercel's GitHub integration deploys production. The pre-rebuild state is commit `0ee6791a70d1f592af3fb51193a6d0676575f870`, also retained as branch `backup/pre-homepage-rebuild-20260928`.

ROCCA branding uses the supplied symbol and exact wordmark artwork. An SVG color filter removes the light background at render time; source shapes remain unchanged. No photo repeats on the homepage. main7 assets are retained for possible later use but are not referenced.

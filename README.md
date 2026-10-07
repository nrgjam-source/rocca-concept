# ROCCA

Static homepage for the existing `rocca-concept-standalone` Vercel project.
Production: https://rocca-concept-standalone.vercel.app/

## Editing

- `index.html`: page content and semantic sections; no bundled/base64 images.
- `assets/css/main.css`: layout, responsive breakpoints, reduced-motion fallback.
- `assets/js/main.js`: mobile navigation, accessible process tabs, viewport-driven motion.
- `assets/main1–main7.webp`: optimized source images; `-800` variants for smaller screens.
- Serve locally with `python3 -m http.server 3000`. No build or dependencies required.

## Homepage flow

Hero → compact full-cycle introduction → solutions → portfolio requests → materials → process tabs with B2B callout → production capabilities → compact engineering → final CTA and calculation form.

The main action is “Рассчитать проект”; a mobile bottom action appears after the hero and hides at the contact form.

## Images

| Image | Current placement |
| --- | --- |
| main5 | Hero, eager loading and high fetch priority |
| main4 | Solution directions overview, conceptual illustration |
| main3 | Materials in architectural context |
| main8 | Engineering, conceptual illustration |

All original images and responsive variants remain in assets for future pages. Below-hero imagery is lazy loaded. No conceptual illustration is presented as a completed ROCCA case or a real manufacturing photograph.

## Pending integrations

See `content/README.md` for verified portfolio/production content slots, journal preservation, contacts and form integration. The frontend creates a mailto draft only. It does not send requests or upload files; attachments must be added manually.

Future material entries should use independent `material`, `application`, and `originCountry` fields without making country the primary navigation.

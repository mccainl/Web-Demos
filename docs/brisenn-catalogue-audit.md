# BRISÉNN catalogue audit —1November2026

The product atelier is a Next.js/React/TypeScript static export at `/Web-Demos/brisenn/products/`. The existing cinematic homepage and simulator remain at `/Web-Demos/brisenn/`. There is no checkout in the concept; each exact variant links to the original store.

## Source coverage

The public store catalogue was retrieved from `https://brisenn.com/products.json?limit=250&currency=EUR`, checked against collection feeds and product pages. All125publishedproducts,239variants and279photographs were retained. Original image URLs, variant IDs, availability, EUR prices and91comparisonprices were compared against the source. The collection audit covers72singlelinks,20smallsets,13largesets,6floor-to-ceiling sets,7Canvas sets and7hanging products. InfinityHook offers70options (35colours in shiny/matte); the newly listed Black links are not listed as Hook variants.

The full public navigation, size/build guides, all Canvas and hanging-system pages, About, custom, shipping and returns were inspected. Titles and handles differ in some cases; routes deliberately use the real handles and show the actual product titles.

## Supplier inconsistencies retained, not silently corrected

- The Arc:30links stated; colour breakdown28. Two rows, approximately190/145cm; two hooks included.
- Floor/Ceiling Candy Matte/Shiny:33links stated; listed quantities32.
- Floor/Ceiling Rainbow:35links stated; listed quantities34;396cm stated length.
- Small Steel Matte: title differs from the written Color Flow description and palette.
- CanvasPrisma duplicates Amalfi's written palette although photographs differ.
- LargeOakShiny&Matte: per-colour finish split unspecified. Contents are labelled accordingly.
- Product dimensions are approximate and sometimes differ from the generic16.5+11.5×(n−1)formula. Published dimensions were preserved.
- The product pages specify25links for all six metal hanging systems,35for InfinityHook. Homepage guidance differs. Product-specific capacities are preserved alongside mounting-surface guidance.
- Shipping policy distinguishes3–4weeks production from2–7days transit; homepage banners abbreviate this. Returns have conditions and a productionfee. The concept links to the full policies without promising unconditional free returns.

##3D fidelity

Link outline uses published16.5×9cm proportions and the observed connecting slit. Acrylic uses physical transmission,1.49IOR, attenuation and separate matte/polished roughness. Thickness and hardware dimensions are visual reconstructions from original photography; manufacturer CAD was not supplied. Canvas colour placement and multirow arrangements are studies, with photographs serving as the reference. Inconsistencies above are disclosed per product. Original photographs are the default view and can be enlarged.

## Official references

- https://brisenn.com/collections
- https://brisenn.com/collections/sets
- https://brisenn.com/collections/large-infinity-sets
- https://brisenn.com/collections/canvas-sets
- https://brisenn.com/collections/floor-to-ceiling-infinity-sets
- https://brisenn.com/collections/hanging-system
- https://brisenn.com/blogs/news/size-guide
- https://brisenn.com/blogs/news/build-your-own-infinity-links
- https://brisenn.com/blogs/news/custom
- https://brisenn.com/policies/shipping-policy
- https://brisenn.com/policies/refund-policy

Run `npm ci`, `npm run check:catalogue`, `npm run typecheck`, `npm run build` from `apps/brisenn-shop`. The repository's product QA workflow builds the export and tests desktop Chromium and mobile WebKit, including actual WebGL geometry and touch gestures.

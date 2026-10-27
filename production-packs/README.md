# MCC campaign production archives — 26 October–2 November 2026

These files are the original MCC campaign content and its distribution-friendly variants.

## Blog articles — original unmodified archive

- [MCC_8_Blog_Articles_NL_EN_Import_Ready.zip](./MCC_8_Blog_Articles_NL_EN_Import_Ready.zip): eight article subjects, Dutch + English Markdown, and typed Next.js MCC-v3 import files. **They are still drafts, not published blog posts.** The article source intentionally contains placeholders for verified live demo URLs.

## Carousels — lightweight posting versions

See [carousels/](./carousels/). There are eight ZIPs, one for each demo:
`MCC_Carousels_<project>_2posts.zip`.

Each ZIP contains two sets of five images, **10 slides at 1080×1350** using visually faithful high-quality JPEG conversions, plus a bilingual Markdown caption draft. These lightweight copies are the easiest to transfer to Instagram/Metricool. All 80 slides are accounted for.

## Carousels — byte-identical original source PNG ZIP

The complete, **unmodified 28,029,335-byte** `MCC_16_Carousels_80_Slides_And_Captions.zip` archive was preserved in 15 pieces at [original-carousels/](./original-carousels/) because transferring the full ZIP through the connected tools at once was not reliable.

To reconstruct the original on a computer, download the 15 files named `MCC_16_Carousels_80_Slides_And_Captions.zip.part01` through `.part15` and `assemble_original_carousels.py`, keeping them in the same directory. Run `python3 assemble_original_carousels.py`.

The script refuses missing parts and verifies original SHA-256:

```text
c688e2c80a92e03de775ae6dbf5c88ed383f04d185d3139b0596cb5a3101079b
```

The source ZIP contains all **80 original PNG slides** and their matching caption drafts. Unlike the lighter JPEGs, this is the exact original production archive.

## Public posting gate

These files being in GitHub **does not mean the articles have been published at mccai.nl or that social posts are scheduled**. Each demo and matching blog URL must be verified, and the owner must approve scheduling. Reels are intentionally the final creative deliverables, each separately reviewed.

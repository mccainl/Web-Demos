# MCC Web Demos

The official public demo repository for [MCC AI Automation](https://mccai.nl).

This repository is reserved for original, interactive MCC concept projects (websites, web applications, automation demos, and AI-assistant demos).

## Publication process

1. Build the interactive project and test both visitor and owner journeys.
2. Add it to this gallery and publish through GitHub Pages.
3. Verify its public URL and its demo-data disclosures.
4. Publish its matching article at [mccai.nl](https://mccai.nl).
5. Only then prepare the campaign's two carousel posts and, **last**, its Reel for individual review.
6. Never schedule or publish social content without explicit approval.

All shown businesses and records are fictional examples. No real reservations, payments, CRM sync, or AI calls occur in the static demos unless separately identified and verified.

**Source image policy:** OpenAI image generation for generated still images. **Video tool policy:** Higgsfield for video only, and audio only if separately approved.

The compiled showcase files will live at the repository root. Until these files and GitHub Pages are deployed, do not treat the future `mccainl.github.io/Web-Demos/` address as a verified live demo.

See the [MCC agent lifecycle playbook](https://github.com/mariocarloschaves/MCC/blob/main/docs/content-lifecycle.md) (available to authorized team members).


## Deploy the eight completed demos

The complete prepared eight-project artifact is **`MCC_8_Demos_GitHub_Pages_Upload_Ready.zip`** (about 1.7 MB). The verified archive was generated in the MCC ChatGPT project and contains the interactive portfolio and the static image assets.

The owner needs to place this one file in the **repository root** with its exact filename using GitHub → **Add file → Upload files → Commit changes**. The checked-in [Pages workflow](./.github/workflows/pages.yml) then:

- verifies the archive contains the gallery and all eight required projects;
- rejects unsafe archive paths, symlinks and overlarge individual files;
- extracts everything in GitHub Actions and deploys the static website.

GitHub Pages also needs **Settings → Pages → Build and deployment → Source: GitHub Actions**, a setting that cannot be changed by the currently available GitHub connector. This is not a request for secrets or personal GitHub tokens.

**Release status:** At initial repository setup, the ZIP is not yet uploaded, and GitHub Pages cannot be claimed live. After the upload and successful deployment, test these routes: `/Web-Demos/`, `/marea-stay/`, `/factuurflow/`, `/haven-interiors/`, `/leadpilot/`, `/pulse-studio/`, `/vraagassistent/`, `/rivier-coffee/`, and `/orderbridge/`. Verify sample booking data never leaves the browser. Only then publish matching MCC blog posts and, lastly, produce the eight Reels for individual approval.

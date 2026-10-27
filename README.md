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

Place this file in the **repository root** with its exact filename. The assistant can validate and commit it after the original ZIP is attached to the active conversation; a manual GitHub upload is also possible through **Add file → Upload files → Commit changes**. The checked-in [Pages workflow](./.github/workflows/pages.yml) then:

- verifies the archive contains the gallery and all eight required projects;
- rejects unsafe archive paths, symlinks and overlarge individual files;
- extracts everything in GitHub Actions and deploys the static website.

**GitHub Pages setup completed on 27 October 2026:** Settings → Pages → Build and deployment → Source is now **GitHub Actions**. GitHub confirmed “GitHub Pages source saved.” Keep the existing workflow; no additional template workflow is needed.

**Release status — verified 27 October 2026:** The ZIP is still missing, so the gallery is **not deployed**. The [initial workflow run](https://github.com/mccainl/Web-Demos/actions/runs/40466534259) passed its missing-file check but **skipped artifact upload and deployment**. The original demo ZIP must be supplied before deployment can proceed.

After upload and a successful deployment, test these exact project routes:

- `/Web-Demos/`
- `/Web-Demos/marea-stay/`
- `/Web-Demos/factuurflow/`
- `/Web-Demos/haven-interiors/`
- `/Web-Demos/leadpilot/`
- `/Web-Demos/pulse-studio/`
- `/Web-Demos/vraagassistent/`
- `/Web-Demos/rivier-coffee/`
- `/Web-Demos/orderbridge/`

Verify customer/owner interactions, mobile layouts, genuine browser persistence and that sample booking data never leaves the browser. Only then publish matching MCC blog posts and, lastly, produce the eight Reels for individual approval.

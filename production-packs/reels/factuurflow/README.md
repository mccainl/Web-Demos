# FactuurFlow — spatial motion review

Status: rendering for individual owner review. Not approved or scheduled.

Owner direction (27 October 2026): leave Marea unchanged; raise the next Reel's visual quality using dimensional interface presentation, camera movement, depth and polished motion design. See MCC docs/content-lifecycle.md.

## Production

38-second vertical review, 720×1280 / 30fps, supersampled at 1080×1920 before downscaling. Real interface captures are arranged as textured planes with perspective, layered depth, shadows, lighting sweeps and camera/object motion. This is a composited spatial UI presentation, not a newly built 3D website or a generative reconstruction of the interface.

The source capture script uses the live working demo, processes the deliberately incorrect Bureau Atlas invoice, captures the discrepancy, corrects €485.00 to €405.35, approves it and verifies the resulting count. All data is fictitious; no external accounting integration is claimed. Both corresponding articles were checked HTTP 200 during capture.

- Demo: https://mccainl.github.io/Web-Demos/factuurflow/
- Dutch article: https://mccai.nl/v3/nl/blog/factuurflow
- English article: https://mccai.nl/v3/en/blog/factuurflow
- Audio: silent visual review; licensed platform music remains pending.
- No AI-video generation job or paid audio generation was submitted for this cut. Media processing used the Higgsfield sandbox; no claim is made about subscription or processing fees.

## Reproduction

Run from a working directory with a `mcc-factuurflow/` folder. Put these three source files in that folder. In the Higgsfield media sandbox, run `node mcc-factuurflow/capture.cjs`, then `node mcc-factuurflow/render.cjs --inspect` for six still checks or `node mcc-factuurflow/render.cjs` for the video. Requires the sandbox's installed Playwright Chromium and FFmpeg. Obtain a new media upload destination before rendering; upload the final output within the same producing command. Never commit signed upload URLs.

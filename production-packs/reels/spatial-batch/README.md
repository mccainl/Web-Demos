# Spatial Reel production source

These scripts reproduce seven project-specific spatial compositions based on the FactuurFlow direction positively reviewed by the owner.

1. Create a `mcc-batch/<project-slug>/` working directory for each entry in configs.json.
2. Place each project's `spatial-scene.html` there as `scene.html`.
3. Run `node mcc-batch/capture.cjs` using the Higgsfield media sandbox toolchain (Playwright Chromium, Node and FFmpeg).
4. Run `node mcc-batch/render.cjs <project-slug> --inspect` and inspect scene stills.
5. Obtain a fresh media upload destination before a full render, then run `node mcc-batch/render.cjs <project-slug>` and upload its output in the same command.

Each output is 38s / 30fps / 720×1280, supersampled at 1080×1920. Limit concurrency to fit the available CPU and sandbox job lifetime; use separate jobs for long batches. Signed upload destinations are temporary credentials and must never be committed.

Final scene sources include the timeline QA fixes: intermediate owner scenes do not show final summary counts before the action; LeadPilot's final caption describes the proposal stage actually shown. Source renders produce the corrected scenes directly. Short segment replacement was used in production to avoid re-rendering already verified footage; the committed scene files incorporate those corrections.

The media remains silent for visual review. Platform music, rights verification and scheduling remain separate.

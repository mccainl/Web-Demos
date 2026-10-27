# FactuurFlow — spatial motion review

Status: completed silent visual review cut; awaiting individual owner feedback. Not approved or scheduled.

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

## Review asset and validation

[Watch the 38-second review cut](https://d2ol7oe51mr4n9.cloudfront.net/user_3IDQioFnKEdiBTSpvyKkSdi5fp9/e269cf9a-0431-4700-a5b0-d9d189318627.mp4)

Confirmed media ID: `e269cf9a-0431-4700-a5b0-d9d189318627`. Export: 720×1280, 30fps, 38.000 seconds, 5,325,654 bytes. Full file decoded without errors. Six scene stills inspected before rendering; exported frames at 15, 28 and 37 seconds inspected after rendering. This does not imply owner approval or a full real-time visual watch.

## Caption draft — awaiting review

### Nederlands
Een afwijkend factuurtotaal hoort niet ongemerkt door je proces te gaan.

FactuurFlow laat zien hoe intake, herberekening en beoordeling kunnen samenwerken — met de eigenaar aan het stuur. Een werkende MCC-conceptdemo met fictieve gegevens; geen live OCR of boekhoudkoppeling.

Probeer de demo: https://mccainl.github.io/Web-Demos/factuurflow/
Lees het artikel: https://mccai.nl/v3/nl/blog/factuurflow

Wil je een oplossing voor jouw proces? DM **CLONE** naar @mccai.nl.

### English
An incorrect invoice total should not slip through your process unnoticed.

FactuurFlow demonstrates intake, recalculation and review, with the owner in control. A working MCC concept using fictional data; no live OCR or accounting integration.

Try the demo: https://mccainl.github.io/Web-Demos/factuurflow/
Read the article: https://mccai.nl/v3/en/blog/factuurflow

Want a version for your workflow? DM **CLONE** to @mccai.nl.

Instagram link-in-bio delivery and licensed platform music must be checked before scheduling. No scheduling or publication is authorized by this draft.

# Marea Stay — dimensional motion experiment 01

Owner brief: a more cinematic, expressive 3D Reel at native 1080×1920, with a feeling of the website coming out of the screen. This is a review-only motion-design experiment; it does not modify the live website or the scheduled campaign.

## Creative treatment

0–5s: camera travel through sculptural coastal arches toward the real website.
5–11s: the exact page image unfolds into twelve spatial layers; room and price panels emerge.
11–17s: the Dune Suite enters from the foreground and settles into a readable hero position.
17–23s: room, price and confirmation states connect in depth.
23–29s: owner reservations and check-in state become the focal point.
29–36s: the scene pulls back into the architectural frame; MCC invitation.

## Technical

Native WebGL geometry rendered by Three.js 0.170.0 with perspective camera, extruded/beveled stone arches, metallic frame geometry, environment lighting, an animated water mesh, real-image textures and deterministic timeline animation. 1080×1920, 30fps, 36 seconds, H.264 CRF16 slow, yuv420p, BT.709. Silent visual study, per the owner's request to focus on the video first. Existing screenshots and hotel imagery are reused; no new generated stills, video-model jobs or music generation.

## Inputs and fidelity

Hero/detail/booking/owner screenshots were captured from the functioning Marea demo in the previous verified production pass. Source photographs are the project's coast.webp, suite.webp, pool.webp and terrace.webp. Fictitious guest, booking and financial data only. The production's stylized 3D architecture is an advertising visualization, not a claim that these animations are installed in the current live website.

Demo: https://mccainl.github.io/Web-Demos/marea-stay/
Article: https://mccai.nl/v3/nl/blog/marea-stay

## Reproduce

Requires Node, npm, Chromium via Playwright and FFmpeg. The script uses the Higgsfield sandbox Playwright path `/usr/local/lib/node_modules/playwright`; adapt the require path if running elsewhere.

1. `npm install three@0.170.0`
2. `node render.cjs --inspect` to make six preview frames.
3. `node render.cjs 0 1080 review.mp4` for the full native 1080p sequence, or render non-overlapping 360-frame chunks and concatenate them with FFmpeg stream copy.

`scene.html` requests Fraunces and Inter from Google Fonts; allow the fonts to load before capturing. The renderer waits for document.fonts.ready. Three.js is MIT licensed; its license accompanies this bundle. Source images remain part of the MCC project assets. A later export should include the then-current validation report and be reviewed before publication.


## Completed review export

[Watch/download the 1080p experiment](https://d2ol7oe51mr4n9.cloudfront.net/user_3IDQioFnKEdiBTSpvyKkSdi5fp9/adffaf8d-35ed-4aa8-8f8a-f0e2cce02063.mp4) · [Source bundle](https://d2ol7oe51mr4n9.cloudfront.net/user_3IDQioFnKEdiBTSpvyKkSdi5fp9/8e984da0-382d-44b5-9c1e-aa12f485ed09.zip)

Validation: 1080×1920, 30 fps, 1080 frames, 36.000 seconds, 23,217,343 bytes; full decode passed. Six exported shot samples inspected. Silent visual experiment. SHA-256: `657f8877fc2a108f45179898e97d90836ac088d340c84c7eddaa6600bd1d94dc`.

Status: **awaiting owner feedback**. The existing scheduled campaign was not replaced or changed. Do not use this experiment to infer approval of a new music direction or automatic publication.

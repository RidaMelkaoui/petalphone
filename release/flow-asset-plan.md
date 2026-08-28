# Flow asset plan and credit ledger

Hard limit: 300 credits for the complete Petalphone Flow session, including revisions.

Google's current published cost for a non-Ultra account is 10 credits per Veo 3.1 Lite generation and 20 credits per Veo 3.1 Fast generation. Costs are per generated result, so Flow must be set to one output before each request. The final cost shown in Flow takes priority if the service changes its pricing.

Official cost page: https://support.google.com/flow/answer/16526234

## Art direction shared by every asset

Hand-drawn children's-book character made with colored pencil and soft watercolor on textured paper. Small natural imperfections, uneven warm brown outlines, simple readable silhouette, muted garden colors, cream face, tiny dot eyes, rosy cheeks. It must feel drawn by one human illustrator. No 3D render, glossy plastic, vector-perfect edges, neon colors, text, logo, UI, photorealism, extra limbs, or busy background.

Use `assets/petalphone/bloomling-sprout.png` and `assets/petalphone/bloomling-flower.png` as the visual references. Keep a transparent background for still images when Flow supports it. Otherwise use one flat cream background that can be removed cleanly.

## Paid Bloomling stills

Image generations use the no-charge image model when available.

1. Acorn Bloomling
   - A tiny warm brown acorn character with an olive cap, cream face, leaf arms, and little rounded feet. Calm smile. Front view. Centered with generous empty space.
2. Mushroom Bloomling
   - A tiny coral mushroom character with two uneven cream spots, a cream face in the stem, short leaf arms, and little rounded feet. Friendly, slightly shy expression. Front view. Centered.
3. Moonflower Bloomling
   - A tiny dusty blue bell-shaped flower character with a pale yellow center, cream face, two soft green leaf arms, and little rounded feet. Sleepy smile. Front view. Centered.

## Motion A: Sprout hello

Input frame: `assets/petalphone/bloomling-sprout.png`

Prompt:

Animate only this exact hand-drawn Bloomling. Four-second seamless loop. It gives one small shy wave with its raised leaf arm, blinks once, and settles with a soft pencil wobble. Keep the body, face, colors, proportions, paper texture, framing, and flat illustration style unchanged. Static camera. No zoom, pan, new objects, text, sound, background changes, morphing, or extra limbs. The first and last frame should match closely.

## Motion B: Flower cheer

Input frame: `assets/petalphone/bloomling-flower.png`

Prompt:

Animate only this exact hand-drawn Bloomling. Four-second seamless loop. It makes one tiny happy bounce, the petals lag gently like paper cutouts, the eyes blink once, and it returns to the starting pose. Keep the face, colors, proportions, pencil texture, framing, and flat illustration style unchanged. Static camera. No zoom, pan, new objects, text, sound, background changes, morphing, or extra limbs. The first and last frame should match closely.

## Credit budget

| Work | Planned outputs | Maximum credits |
| --- | ---: | ---: |
| Sprout hello first pass, Veo 3.1 Lite | 1 | 10 |
| Flower cheer first pass, Veo 3.1 Lite | 1 | 10 |
| Sprout revision | 1 | 10 |
| Flower revision | 1 | 10 |
| Two optional alternate motions | 2 | 20 |
| One optional Fast pass if Lite cannot hold the art | 1 | 20 |
| Reserve for unexpected per-output settings | n/a | 20 |
| Planned ceiling |  | 100 |

The remaining 200 credits are a hard safety margin. Do not spend them without a visible quality reason. Stop before any action that would put the session above 300 total credits.

## Actual ledger

| Time | Action | Credits before | Credits after | Used |
| --- | --- | ---: | ---: | ---: |
| Pending | No Flow generation started | Pending | Pending | 0 |

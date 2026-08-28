# Petalphone

Petalphone is a cozy pass-and-play drawing telephone game for 2 to 8 people sharing one phone.

The app is built with Expo and React Native for iOS and Android. Gameplay, drawings, names, custom prompts, settings, and finished games stay on the device. There are no ads, accounts, analytics, or online multiplayer services.

## Local development

1. Copy `.env.example` to `.env.local` and add the RevenueCat key needed for the build you are testing.
2. Install dependencies with `npm install`.
3. Start the project with `npm start`.

Real in-app purchases require an Expo development build or store build on a physical device. Expo Go and the web preview are useful for interface testing but cannot prove a live store purchase.

## Checks

```text
npm run typecheck
npm run lint
npm run doctor
npm run export:web
```

Release notes, store copy, reviewer instructions, privacy declarations, and the final checklist are in `release/`.

## Public pages

- Home: https://ridamelkaoui.github.io/petalphone/
- Privacy: https://ridamelkaoui.github.io/petalphone/privacy/
- Terms: https://ridamelkaoui.github.io/petalphone/terms/
- Support: https://ridamelkaoui.github.io/petalphone/support/

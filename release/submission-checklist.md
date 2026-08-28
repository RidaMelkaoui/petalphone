# Submission checklist

## Build identity

- [ ] App name is Petalphone on the device and in both store records
- [ ] Bundle ID and package are `com.ridamelkaoui.petalphone`
- [ ] Apple product is `com.ridamelkaoui.petalphone.fullgarden`
- [ ] Google product is `full_garden`
- [ ] Version is 1.0.0 and store build numbers are unique
- [ ] Production build does not contain a RevenueCat Test Store key

## Product and purchase

- [ ] Free experience includes 120 prompts and the full game loop
- [ ] Full Garden description exactly matches the unlocked content
- [ ] Regional price comes from the store, never hard-coded
- [ ] Purchase, cancellation, interruption, and restore are tested on a physical iPhone
- [ ] Purchase, cancellation, interruption, and restore are tested on a physical Android phone
- [ ] Full Garden remains available after relaunch and reinstall with restore
- [ ] First Apple in-app purchase is attached to the first app version submission

## Quality

- [ ] Two-player, four-player, and eight-player games finish correctly
- [ ] 1, 3, and 5 round games finish correctly
- [ ] Cozy, Classic, and Quick paces finish correctly
- [ ] Incoming call, backgrounding, rotation lock, and low-memory recovery do not corrupt a game
- [ ] Small and large supported phones have no clipped controls
- [ ] Screen reader labels, focus order, text scaling, reduced motion, and contrast are checked
- [ ] No keyboard remains open after a private guess is submitted
- [ ] Delete local game data removes names, drawings, history, and custom decks but not the purchase

## Privacy and policy

- [ ] Privacy, terms, support, and marketing URLs load publicly over HTTPS
- [ ] Store privacy answers match the final app and RevenueCat SDK behavior
- [ ] No ad, analytics, tracking, social login, or unused permission SDK is included
- [ ] Age and content rating answers match the built-in prompt library
- [ ] Support email is monitored

## Store media

- [ ] Screenshots come from the exact production build
- [ ] Screenshots show real gameplay states and no unavailable features
- [ ] Phone screenshots only for Apple because iPad support is disabled
- [ ] App icon has no transparency on iOS and passes safe-area checks on Android
- [ ] Description, subtitle, keywords, release notes, and purchase text are proofread

## Release control

- [ ] Android goes through internal testing and Play pre-launch report first
- [ ] iOS goes through internal TestFlight, then external TestFlight
- [ ] Apple release is manual after approval
- [ ] Google production submission is a draft or staged rollout until final approval
- [ ] Reviewer notes explain the pass screen and exact Full Garden path

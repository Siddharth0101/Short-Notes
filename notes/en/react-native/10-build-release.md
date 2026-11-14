---
id: rn-build-release
title: Builds, signing, OTA updates and revision traps
track: react-native
order: 10
level: Advanced
minutes: 4
summary: Development/production — debug tools and release configuration differ; smoke-test the release build.
tags: react-native, mobile, expo, build-release
---

## Quick revision

> Revision target — Understand the compatibility contract between a JS update and the native binary; rehearse data rollback along with the rollout.

### Shipping

- Development/production — debug tools and release configuration differ; smoke-test the release build.
- App identity — the Android applicationId/iOS bundle identifier is the stable product identity; separate from the display name.
- Signing — manage release credentials securely; a signed build artifact is not the same as store approval.
- EAS Build — a service that builds the configured Android/iOS binaries; store submission/review are separate steps.
- Build profiles — separate development, preview and production config; verify the correct API endpoint.
- Release checks — test a cold start, auth, a deep link, permissions and the data migration on upgrade.

### Updates and interview traps

- OTA update — an update of compatible JS/assets; it cannot arbitrarily change the installed native binary.
- Runtime version — the compatibility boundary between an update and a native build; if a native module changes you need a rebuild and a compatible runtime.
- Rollout — start with a small audience; expand or roll back after looking at crash/error metrics.
- Rollback limit — reverting code does not automatically undo server/schema side effects.
- Revision trap — an Expo app is React Native too; do not treat the limits of Expo Go as the limits of the whole Expo ecosystem.
- Capstone — a paginated list → detail → saved preference; demonstrate offline/error, accessibility and resume behaviour.

### Configuration and release versions

- EXPO_PUBLIC variables — inlined/readable in the client bundle; an environment name does not make it secret storage.
- Environment match — align the preview/production API config in both the build and the update; detect a wrong backend before release.
- User version — the app's visible version; separate from the Android versionCode/iOS buildNumber upload/build identity.
- Build increment — follow the platform rules for a store upload; do not assume a JS update number is the native build number.
- Gradle/Xcode — the Android/iOS native build toolchains; Metro bundling success is not proof of native compilation success.
- Build credentials — the package/bundle ID, signing config and intended profile must match; a binary with the wrong identity can become a different app.

### Edge cases and reasoning

- Update identity tuple — inspect platform+channel/runtime compatibility; a matching channel alone does not make a missing native module safe.
- Rollback data compatibility — an old JS update fails if it reads a newer persisted schema; rehearse the forward/backward storage migration contract.
- Crash diagnostics — retain the deployed build/update ID and the matching source maps/symbols; a local source stack can misdiagnose an unrelated release.

## Understand it with an example

- Scenario — release B uses a new native module, but the device has the old binary of release A installed.
- Trace — a JS update cannot create a missing native implementation; the compatible build/runtime boundary has to be enforced.
- Decision — distribute the required native build; verify the runtime compatibility policy along with the update channel.
- Catch — a code rollback does not automatically reverse the storage schema or server side effects.
- Check — verify recoverable behaviour for an upgrade from an old install, reading a persisted draft, a wrong API config and a rollback.

## Recall and practice

- Question — Why is publishing an OTA on the same runtimeVersion after adding a native module not compatible?
- Answer — The old binary lacks the native implementation; a rebuild and the correct compatibility/runtime policy are required, and the channel alone is not a fix.
- Try it yourself — Run a preview release checklist; verify an installed old binary, a native module change, a wrong backend, a persisted schema upgrade and the data read after a rollback.

## Practice questions

### Easy · What does an OTA update not ship?

<details>
<summary>Answer</summary>

- OTA — can change the JS bundle and assets.
- Not — native code, new native modules, permission/`Info.plist`/`AndroidManifest` changes; those need a store build.
- `runtimeVersion` — an update reaches only a compatible native build; it protects against a crash on mismatch.

</details>

### Easy · A secret in `EXPO_PUBLIC_API_KEY`

<details>
<summary>Answer</summary>

- `EXPO_PUBLIC_` variables are inlined into the JS bundle at build time; anyone who downloads the app can read them.
- Secret — keep it on the server; the app gets a short-lived token from the server.
- Use `EXPO_PUBLIC_` only for public values (the API base URL, a public analytics key).

</details>

### Medium · Store upload rejected: "build number already used"

<details>
<summary>Answer</summary>

- `version` — the one the user sees (1.4.0).
- Build number — iOS `buildNumber` / Android `versionCode`; it must increase with every upload.
- Fix — EAS `autoIncrement` or remote app versioning, so nobody has to remember it manually.

</details>

### Medium · Rolling back a bad OTA update

The crash rate went up after a new OTA update. What do you do, and what is the limit of a rollback?

<details>
<summary>Answer</summary>

- Immediately — pause the rollout and republish/roll back to the previous update.
- Future — a staged rollout (e.g. 10% → 50% → 100%) with crash monitoring.
- Limit — a rollback brings the code back, not the data. If the new version changed the local DB schema/storage format, the old code cannot read it — keep migrations backward-compatible.

</details>

### Hard · Release checklist

What do you verify before a production release?

<details>
<summary>Answer</summary>

- Build — the `production` profile, the correct bundle id/package, signing credentials, an incremented build number.
- Config — production env values, no dev menus/logs, the `runtimeVersion` policy.
- Quality — real devices (a low-end Android too), offline/permission-denied flows, accessibility checks.
- Observability — crash reporting with source maps uploaded, a release tag.
- Rollout — a staged release, a monitoring dashboard, a written rollback plan.

</details>

## Sources — further reading

- [Expo runtime-version compatibility](https://docs.expo.dev/eas-update/runtime-versions/)

- [Expo — environment variables](https://docs.expo.dev/guides/environment-variables/)
- [Expo — app versions](https://docs.expo.dev/build-reference/app-versions/)

- [Expo store builds](https://docs.expo.dev/deploy/build-project/)
- [Build configuration](https://docs.expo.dev/build/eas-json/)
- [Development builds](https://docs.expo.dev/develop/development-builds/introduction/)

# Handoff: BitBuzz Mobile — front-end redesign

## Overview

A full visual and interaction redesign of the BitBuzz Mobile client (`hridhaan-s/The-BitBuzz-MobileApp`, Expo + React Native + TypeScript + Expo Router). Fifteen screens covering the whole reader journey: guest browsing, authentication, onboarding, a personalised Today feed, three article-reader layouts, desk browsing, search, saved, alerts, opportunities, author pages, story pitching, profile, settings, the privacy policy, and the report / block / delete-account flows the app stores require.

**The backend does not change.** Every query, table and column the current app uses stays exactly as it is. The redesign is front-end only.

Two goals drove it:

1. **Premium craft** — the previous UI read as a web dashboard (1px borders on every box, unicode glyphs for icons, monospace labels everywhere). This pass applies iOS conventions properly: translucent nav/tab materials, drawn icons, borderless surfaces, a single accent colour, and typography that carries hierarchy through weight rather than colour.
2. **Daily habit** — the reader who opens it every morning. A finite five-story brief that can be finished, a visible streak, and a reader that ends in a queue rather than an exit.

## About the design files

The files in this bundle are **design references written in HTML**. They are prototypes showing intended look and behaviour — not production code to copy.

The task is to **recreate these designs in the existing React Native / Expo codebase**, using its established patterns: `StyleSheet.create`, `expo-router` navigation, `@expo/vector-icons`, `expo-haptics`, and the existing `src/constants/theme.ts` token file. Do not port the HTML. Read it for layout, values and behaviour, then build the React Native equivalent.

`BitBuzz Mobile v2.dc.html` opens in any browser. `ios-frame.jsx` is only the device bezel used to present the screens — it has no counterpart in the app and should be ignored.

## Fidelity

**High fidelity.** Colours, type sizes, weights, letter-spacing, radii and spacing are all final and stated exactly below. Recreate them pixel-for-pixel. Where a value here conflicts with the current `src/constants/theme.ts`, this document wins — the token file should be updated to match (section: Design tokens).

---

## Design tokens

### Colour

Extends the existing `src/constants/theme.ts`. Values marked **new** should be added.

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#000000` | Screen background. **Changed** from `#050505` — true black, so OLED panels switch pixels off and full-bleed images have no visible seam against the frame. |
| `surface` | `#0e0e10` | **New.** Cards, grouped list containers, muted panels. |
| `surface2` | `#141416` | **New.** Input fields, secondary buttons, unselected chips. |
| `surface3` | `#1c1c20` | **New.** Tertiary buttons on top of `surface`. |
| `accentSurface` | `#15110b` | **New.** Amber-tinted card (morning brief, streak card, unread alert). |
| `greenSurface` | `#0b1410` | **New.** Read-later queue card. |
| `text` | `#ffffff` | Primary text. |
| `textSecondary` | `rgba(255,255,255,0.86)` | Reader body copy. |
| `textMuted` | `rgba(255,255,255,0.50)` | Standfirsts, descriptions. |
| `textFaint` | `rgba(255,255,255,0.34)` | Bylines, captions, metadata. |
| `line` | `rgba(255,255,255,0.07)` | List dividers. The **only** remaining border in the system. |
| `accent` | `#ffc48f` | Unchanged. The single action colour: primary buttons, active tab, progress fills, links, selected chips. |
| `onAccent` | `#1b1206` | **New.** Text and icons on an amber fill. |
| `alert` | `#ff3b30` | **New.** Notification badge, unread markers, destructive actions (sign out). Never decorative. |
| `blue` | `#83adff` | Unchanged. Author desk line, informational text. |
| `green` | `#7ee0a1` | Success, positive trend, confirmed states. |

Desk hues — used **once per card, as a single uppercase word**. Never as a fill, never as a border.

| Desk | Hex |
| --- | --- |
| Space | `#9dbcff` |
| Cybersecurity | `#ff9aa8` |
| Technology | `#c4acff` |
| Aviation | `#7ee0a1` |
| Innovation | `#ffc48f` |
| Biology | `#7fdfd0` |

### Typography

Family: the app's system sans (`-apple-system` / Roboto). The prototype renders in Phantom Sans because that is this project's bound design system; **in the app, use the platform system font** — it is closer to the intended humanist geometric feel on device and costs nothing to load.

Monospace: `Consolas, ui-monospace, SF Mono, Menlo` — used **only for numbers**: the streak, the 3/5 brief counter, deadline countdowns, timestamps, trending ranks. Everything else is sans. Always set `fontVariant: ['tabular-nums']` on numerals.

| Role | Size | Weight | Letter-spacing | Line-height |
| --- | --- | --- | --- | --- |
| Large title (screen headers) | 36 | 800 | −1.7 | 1.04 |
| Hero headline (reader, immersive) | 38 | 800 | −2.0 | 1.04 |
| Lead card headline | 33 | 800 | −1.6 | 1.06 |
| Section hero | 30 | 800 | −1.4 | 1.06 |
| Card headline | 20 | 750 | −0.5 | 1.14 |
| Body | 17 | 400 | 0 | 1.52 |
| Standfirst | 16 | 400 | 0 | 1.45 |
| Metadata | 12 | 600 | 0.4 | 1.25 |
| Caption | 11 | 500 | 0.2 | 1.3 |
| Label | 10 | 700 | 1.2 | 1.2 |
| Button | 15 | 700 | 0 | 1 |

Do not use monospace for labels, category names or buttons. The only exception is a number or countdown.

---

## Interaction principles

- The app is dark-only in v2. Do not add a light theme switch.
- Use native press feedback and `expo-haptics` for meaningful actions. Do not vibrate on every navigation tap.
- Use system icons from `@expo/vector-icons`; never Unicode symbols for interface icons.
- Use `Pressable` and `Animated` rather than CSS animations. Every card/button should have a pressed state (`opacity: 0.82` or a 0.98 scale).
- Use `SafeAreaView` / `useSafeAreaInsets` so content never sits under the Dynamic Island or home indicator.
- Lists use `FlatList` / `ScrollView`, not nested unbounded views.
- The bottom tab bar is translucent with the active item in amber.
- Every screen has an explicit loading, empty and error state. Never leave a blank screen.
- Destructive actions are always confirmed in a native alert/action sheet.
- External URLs open through `Linking.openURL` and should never silently navigate the app away.

---

## Screen inventory

### 01 — Guest / welcome

Purpose: first impression for signed-out users.

- True-black full-bleed screen.
- BitBuzz logo at top-left, 52 × 52, 26 radius.
- Eyebrow: `THE WORLD, DECODED.`
- Hero: `News that moves.`
- Body: `Five stories. A few minutes. Everything worth knowing.`
- Primary amber button: `Continue`.
- Secondary text button: `Sign in`.
- Footer: `By BitBuzz · Student newsroom`.

### 02 — Authentication

Two states: sign in and create account.

- Back chevron.
- Logo.
- Large title `Welcome back.` / `Create your account.`
- Email and password inputs.
- Amber filled action.
- Apple / Google buttons are **not** required unless an auth provider is actually configured in Supabase.
- `Forgot password?` uses the existing password-reset route.
- Inline error state under the form.

### 03 — Onboarding / interests

After first account creation.

- Header: `Make it yours.`
- Copy: `Pick the desks you want in your morning brief.`
- Six desk chips: SPACE, CYBERSECURITY, TECHNOLOGY, AVIATION, INNOVATION, BIOLOGY.
- Selected chip: amber fill + `onAccent` text.
- Minimum one selection.
- `Continue` is disabled until one desk is selected.
- Persist selections in the existing backend only if the current schema supports it; otherwise keep them locally with AsyncStorage. **Do not invent a Supabase table.**

### 04 — Today / morning brief

The core home screen.

Top:
- Small BitBuzz logo.
- `TODAY` label.
- `Tuesday, 16 September` style date.
- Bell button.

Hero card:
- `YOUR MORNING BRIEF`
- `5 stories · ~6 min`
- Amber surface, no border.

Brief progress:
- `3 / 5` in monospace.
- Thin amber progress bar.

Five-story feed:
- First item is a lead card with image and 33px headline.
- Remaining items use compact cards.
- Each card has one desk label in its desk colour.
- Save icon on every card.

End card:
- Green surface.
- `YOU'RE CAUGHT UP`
- `Read later` count.
- `Keep exploring` action.

The feed must use the existing `articles` query. Do not invent a `trending_score` column. If no ranking data exists, preserve the editorial order returned by the backend.

### 05 — Latest

Accessible from Today via the `Latest` segmented control.

- Header: `Latest`.
- Compact list sorted by `published_at DESC` using the existing query.
- Pull-to-refresh.
- Loading skeleton.
- Empty and error states.

### 06 — Article reader / standard

- Native back button.
- Desk label.
- Title.
- Standfirst.
- Byline + read time + published date.
- Full-width cover image.
- Body typography at 17px / 1.52.
- Bookmark and share actions.
- Markdown parsing must remain compatible with `body_md` currently returned by Supabase.
- Never render raw HTML.

### 07 — Article reader / immersive

For stories with a cover image.

- Full-bleed image at top.
- Gradient/scrim into black.
- Hero headline over lower image edge.
- Reader body below.
- Floating glass back / save / share buttons.
- Same content source as standard reader.

### 08 — Article reader / text-first

For stories without a cover image.

- No empty image placeholder.
- Title immediately below navigation.
- Generous 24px side padding.
- Body and metadata as standard reader.

### 09 — Explore / desks

- Large title `Explore.`
- Search field with native magnifier.
- Six desk rows with one colour accent each.
- No giant coloured cards.
- Tapping a desk opens its article list.
- Search debounced at ~250ms and uses the existing Supabase search capability.

### 10 — Search results

- Search field stays pinned at top.
- Query text.
- Result count.
- Compact article list.
- Empty state: `Nothing here yet.`
- Error state with retry.

### 11 — Saved

- Header `Saved.`
- Locally persisted bookmarks using AsyncStorage unless/until a supported backend save table exists.
- Saved cards use the same article data shape as the reader.
- Swipe/press action to remove.
- Empty state: `Save a story. Find it here.`

### 12 — Alerts

- Bell from Today opens alerts.
- Grouped list with unread state.
- Unread marker uses `alert` red only.
- If push notifications are not configured, the screen must not pretend they are. It may show in-app editorial alerts sourced from existing data or a clear `Notifications aren't enabled yet.` state.

### 13 — Opportunities

- Header `Opportunities.`
- Intro: `Build what comes next.`
- Existing `opportunities` table/query remains the source.
- Deadline shown in monospace.
- Type/category as metadata.
- External URL action through Linking.
- Loading / empty / error states.

### 14 — Author / profile

- Profile header.
- Display name from existing `profiles` data when available.
- Author's desk.
- Published stories list where the existing data can support it.
- Signed-out state stays useful and does not require a fake profile.

### 15 — Reader profile / settings

Profile:
- Saved count.
- Reading streak (local, unless backend already supports it).
- Interests.
- Settings rows.

Settings:
- Account.
- Interests.
- Notifications.
- Privacy.
- About BitBuzz.
- Sign out.
- Delete account.

Privacy:
- Use the actual privacy policy URL/content supplied by the project; never invent legal claims.

Delete account:
- Explicit confirmation.
- If Supabase auth deletion cannot be performed securely from the client, show a clear support/contact route instead of pretending deletion succeeded.

---

## Navigation

Five bottom tabs remain:

1. Today
2. Explore
3. Opportunities
4. Saved
5. Profile

Use a translucent dark tab bar. Active icon/label is `accent`; inactive is `textFaint`.

Alerts and article pages are pushed routes, not tabs.

---

## Data contract

Keep the existing backend exactly as-is.

Existing article shape:

```ts
{
  id,
  slug,
  title,
  standfirst,
  cover_image_url,
  cover_alt,
  body_md,
  read_minutes,
  published_at,
  categories: { name, slug } | null,
  profiles: { display_name } | null
}
```

Existing opportunities shape should remain whatever the current mobile query already returns.

**Do not add backend tables or columns solely to make the redesign work.** Local-only features should use AsyncStorage.

---

## Asset rules

- BitBuzz logo: use the existing project logo asset.
- Article cover images: use the existing `cover_image_url` field.
- Never hardcode Unsplash imagery into article content.
- Do not add an image to a screen merely to fill space.
- Respect `cover_alt` where available.

---

## Accessibility

- Minimum practical touch target: 44 × 44.
- Every icon-only button has an accessibility label.
- Do not encode meaning by colour alone.
- Dynamic text should not clip headlines.
- VoiceOver / TalkBack order should follow visual order.

---

## Performance

- Use `FlatList` for long feeds.
- Avoid rendering article body Markdown with a heavyweight webview.
- Remote images should specify dimensions/aspect ratio to reduce layout shift.
- Avoid unnecessary Supabase requests when returning to an already loaded tab.
- Keep animations short and interruptible.

---

## Definition of done

The redesign is considered complete only when:

- [ ] All 15 screens are implemented in React Native.
- [ ] All five tabs work.
- [ ] Article navigation works from every article card.
- [ ] Search works against the existing backend.
- [ ] Saved/bookmark state persists across app restarts.
- [ ] Opportunities load from the existing table.
- [ ] Auth flows use the existing Supabase auth configuration.
- [ ] Loading, empty and error states exist for every network-backed screen.
- [ ] No fake backend fields/tables have been introduced.
- [ ] No service-role key exists in the client.
- [ ] iOS safe-area / Dynamic Island spacing is correct.
- [ ] Android back behaviour is correct.
- [ ] TypeScript passes with `npm run typecheck`.
- [ ] Expo production export/build succeeds.
- [ ] Real iOS/Android device testing has been completed before store submission.

This handoff is the visual source of truth for BitBuzz Mobile v2.
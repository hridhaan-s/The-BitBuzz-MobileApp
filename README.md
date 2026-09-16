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
| Section hero (desk page) | 40 | 800 | −2.1 | 1.02 |
| Title 1 (card titles, brief) | 25 | 700 | −1.0 | 1.16 |
| Title 2 (section headers) | 22 | 700 | −0.8 | 1.2 |
| Title 3 (reader subheads) | 24 | 700 | −1.0 | 1.2 |
| Pull quote | 26 | 700 | −1.0 | 1.30 |
| Story row headline | 18 | 700 | −0.6 | 1.24 |
| Headline (list rows, settings) | 16.5 | 500–600 | −0.4 | 1.26 |
| **Reader body** | **19** | **450** | 0 | **1.68** |
| Body | 17 | 450 | −0.3 | 1.55 |
| Subhead | 15 | 600 | −0.3 | 1.5 |
| Footnote | 13.5 | 400 | 0 | 1.5 |
| Eyebrow (uppercase) | 12 | 700 | +0.9 | 1 |
| Desk label (uppercase) | 11.5 | 700 | +0.9 | 1 |
| Tab label | 10.5 | 600 | −0.1 | 1 |

Reader body at 19/1.68 is the single most important value in this document. It is what separates reading from skimming, and it is what the previous 16/1.75 at 80% opacity was getting wrong.

### Spacing

4pt base. Screen gutter **20** (**22** on reader and privacy screens, for a slightly narrower measure). Vertical rhythm: 8 / 12 / 16 / 20 / 26 / 34 / 38 / 40.

Nav bar height **96** (status bar + 36pt controls + 10 bottom padding). Every screen's top content padding is **112–114** so large titles clear it by 16–18pt.

### Radii

| Value | Use |
| --- | --- |
| 26 | Morning brief card, streak card |
| 24 | Lead story image, opportunity card, "caught up" card |
| 22 | Briefing summary card |
| 20 | Desk tiles, alert cards, author stat bar, profile stat cards |
| 19 | Up-next rows |
| 18 | Settings group container, focus-variant caption card |
| 16 | Story row thumbnails (86×86), primary buttons |
| 15 | Input fields, secondary buttons |
| 14 | Search result thumbnails (62×62) |
| 13 | Up-next thumbnails (58×58) |
| Pill | Interest chips (h46 r23), follow buttons (h34 r17), nav buttons (36 r18) |

### Elevation

No shadows anywhere except the settings toggle knob (`0 2px 5px rgba(0,0,0,0.28)`). Depth comes from the fill ladder `#000 → #0e0e10 → #141416 → #1c1c20`. On Android use `elevation: 0` — do not let Material shadows creep in.

### Materials

Nav bar: `rgba(12,12,14,0.72)`, `backdrop-filter: saturate(180%) blur(22px)`, 1px inset bottom hairline at `rgba(255,255,255,0.08)`.
Tab bar: `rgba(12,12,14,0.78)`, same blur at 24px, inset top hairline.
Nav control buttons: `rgba(40,40,44,0.72)` with a 14px blur.

In React Native use `expo-blur`'s `<BlurView tint="dark" intensity={40}>`.

---

## Screens

### 1. Sign in / Create account / Reset password

**Purpose** — account entry. Replaces nothing; the current mobile app has no auth screen. Mirrors the web app's `src/AuthPage.tsx` exactly.

**Layout** — full-screen, padding `88 / 24 / 46`, column flex, footer pushed down with `marginTop: auto`.

- Logo 52×52, radius 26, from `media.logo`.
- Large title 38/800/−2.0, 26 above. Copy switches by mode: `Welcome back.` / `Join BitBuzz.` / `Reset your password.`
- Subtitle 17/450 at `textMuted`, 14 above. `Sign in to pick up your reading where you left it.` / `Create your account to save stories, follow desks and pitch to the newsroom.` / `Enter your email and we'll send you a secure reset link.`
- **Segmented control** (hidden in forgot mode) — `#141416` track, 4pt inner padding, radius 14. Each segment h42, radius 11. Active: white fill, black text. Inactive: transparent, `rgba(255,255,255,0.45)`.
- **Fields** — h52, radius 15, `#141416`, no border, 17pt text, 17 horizontal padding. Label above each: 14/600 at `rgba(255,255,255,0.42)`, 9 below. Email always; Password when not in forgot mode; Confirm password on signup only.
- **Error** — `#22100f` fill, radius 14, 14/16 padding, text `#ff7a6e` at 14.5/1.5.
- **Success** — `#0d1f18` fill, text `#7ee0a1`.
- **Primary button** — h54, radius 16, `#ffc48f` on `#1b1206`, 17/700. Label: `Sign in` / `Create account` / `Send reset link`.
- `Forgot password?` — text button, amber, 15/600, only in signin mode. In forgot mode it becomes `Back to sign in`.
- **Divider** — hairline, `or`, hairline. Then Apple (white fill, black text) and Google (`#141416`, white text) buttons, both h52 radius 15 with a 18px brand mark.
- **Footer** — 13.5/1.6 at `rgba(255,255,255,0.34)`, centred: *By continuing you agree to BitBuzz's terms and [privacy notice]. We only use account information for authentication and the features described there.* The link is amber, 600 weight, and opens the Privacy screen.

**Validation** (match the web app exactly, `src/AuthPage.tsx`):
- Empty email → `Enter your email address.`
- Password under 6 characters → `Your password must be at least 6 characters.`
- Signup with mismatched confirm → `The passwords do not match.`
- Forgot mode success → `If an account exists for that email, we've sent a password reset link. Check your inbox and spam folder.`
- Signup with no session returned → `Your account was created. Check your email to confirm your address before signing in.`

**Backend** — `supabase.auth.signInWithPassword`, `supabase.auth.signUp` (with `options.data.display_name` and `full_name` set to the email local part), `supabase.auth.resetPasswordForEmail`. The Apple and Google buttons are `supabase.auth.signInWithOAuth({ provider })` — Supabase dashboard configuration, not backend code. If those providers are not enabled, remove the two buttons and the divider.

**Routing** — successful sign-in → Today. Successful sign-up → Onboarding.

### 2. Onboarding — interest picker

**Purpose** — collect the desks that build the personalised feed. Step 2 of 3.

**Layout** — padding `92 / 24 / 46`, column, CTA pinned with `marginTop: auto`.

- Progress: three bars, `flex: 1`, h3, radius 2, gap 6. Filled `#ffc48f`, empty `rgba(255,255,255,0.14)`. 38 below.
- Title 38/800/−2.0: *What should we wake you up for?*
- Subtitle 17/450 muted: *Pick three or more. Your morning brief is built from these, and you can change them whenever you like.*
- **Chips** — wrapping row, gap 9, 34 above. Each h46, radius 23, 18 horizontal padding, 16/600 text, with a 7px dot 9pt before the label. Unselected: `#141416` fill, `rgba(255,255,255,0.72)` text, dot in the desk hue. Selected: `#ffc48f` fill, `#1b1206` text, dot at `rgba(27,18,6,0.55)`.
- Eight interests: Space, Cybersecurity, Technology, Aviation, Innovation, Biology, Science, Climate.
- **CTA** — h54 radius 16 amber. Label is `Pick N more` until three are selected, then `Build my feed`.
- Below: *Takes ten seconds. Skip and you get everything.* — 14pt centred at `rgba(255,255,255,0.34)`.

**Persistence** — store on the Supabase profile (`interests text[]`) or, as a first step, AsyncStorage under `@bitbuzz/interests`. The Today feed filters on it.

### 3. Today (home feed)

**Purpose** — the daily landing. This is the screen the habit lives on.

Content padding top **112**. Bottom padding 128 to clear the tab bar.

- **Date line** 15/600 at `rgba(255,255,255,0.40)` — *Wednesday 16 September*.
- **Large title** `Today`, 36/800/−1.7, 3 below the date.
- **Morning brief card** — 26 above, radius 26, fill `#15110b`, full-bleed edge to edge minus the 20 gutter. Two parts:
  - Body, padding 22: eyebrow `YOUR MORNING BRIEF` in amber 12/700/+0.9 uppercase; headline 25/700/−1.0 (*Five stories. Nine minutes. Then you are done.*); a progress row 20 below — track h5 radius 3 at `rgba(255,196,143,0.18)` with an amber fill, and a monospace `3/5` at 12pt to its right.
  - Footer button, full width, padding `16/22`, fill `rgba(255,196,143,0.09)`, 1px top border `rgba(255,196,143,0.14)`. Label `Continue — 3 min left` in amber 16/600, chevron right at the end.
- **Top story** — section header `Top story` 22/700/−0.8, then a 4:5 image card radius 24. Scrim `linear-gradient(to top, rgba(0,0,0,0.92) 8%, rgba(0,0,0,0.35) 48%, rgba(0,0,0,0.12))`. Overlay inset 22, bottom 22: desk word in its hue 12/700 uppercase; headline 33/800/−1.6; byline 14/500 at `rgba(255,255,255,0.62)` formatted `Author · N min read`.
- **In your desks** — story rows, 18 vertical padding, divided by a 1px `line` hairline. Left column: desk word 11.5/700 uppercase in hue; headline 18/700/−0.6; byline 13.5 faint. Right: 86×86 thumbnail radius 16. Gap 16.
- **Desks** — 2-column grid, gap 11, each tile 3:2, radius 20. Image at 55% opacity under a `to top, rgba(0,0,0,0.85) → rgba(0,0,0,0.1)` scrim, name 17/700/−0.5 at bottom-left inset 15/14.
- **End card** — radius 24, `#0e0e10`, padding `30/24`, centred. *You're all caught up.* 21/700, then *The next brief lands at 07:00. We'll nudge you once, never twice.* 15/1.5 at `rgba(255,255,255,0.42)`.

**Data** — the existing query, filtered by interests:

```ts
supabase.from('articles')
  .select('id,slug,title,standfirst,cover_image_url,read_minutes,published_at,categories(name,slug),profiles(display_name)')
  .eq('status','published')
  .order('published_at',{ ascending:false })
  .limit(20)
```

Keep the `Array.isArray(x.categories) ? x.categories[0] : x.categories` normalisation the current code does.

### 4. Article reader — three layouts

The layout is a **user preference**, set in Settings → Reading layout, persisted to AsyncStorage. All three share the byline row, reactions, and up-next queue.

**Shared nav** — the blurred bar with back, bookmark (fills amber when saved) and share. A 2px progress hairline sits directly under it, amber fill, width = scroll percentage. Both fade in together.

**A. Immersive** (default) — 520px cover, scrim `to top, #000 3%, rgba(0,0,0,0.4) 44%, rgba(0,0,0,0.55)`. Desk word and a 38/800/−2.0 headline overlaid at inset 22, bottom 26. Standfirst 19/450 at `rgba(255,255,255,0.6)` below the image, 22 padding.

**B. Focus** — padding-top 114, no cover in flow. Desk word, headline 36/800/−1.8, standfirst. Then a caption card: `#0e0e10`, radius 18, padding 14, holding a 64×64 thumbnail (radius 13) beside 13/1.5 caption text.

**C. Briefing** — padding-top 114, headline 32/800/−1.5, then a `#0e0e10` card radius 22 padding 22 titled *The thirty-second version* — three bullet rows, each a 7px amber dot beside 17/1.5 text. Body is then rendered as titled sections (23/700/−0.9) each closing with a `#0e0e10` radius-16 card headed *Why it matters* in amber 12/700 uppercase.

**Byline row** — 18 vertical padding between two `line` hairlines. 40px avatar circle with a `linear-gradient(145deg,#ffc48f,#f09a63)` fill and the author's initials in `#1b1206` 14/700. Name 15/600; monospace stamp below at 11.5 faint, formatted `16 Sep · 06:40 · 6 min read`. Follow button on the right, h34 radius 17, amber when not following, `#1c1c20` when following.

**Prose** — paragraphs 19/1.68 at `rgba(255,255,255,0.86)`, 26 apart, gutter 22.
**Pull quote** — no rule, no background, no left border. Just 26/700/−1.0 white text with 36 of space above and below, and an attribution below at 13.5/500 in `rgba(255,196,143,0.85)`.
**Inline image** — full-bleed (breaks the 22 gutter), 230 tall, no radius, caption 13/1.5 faint below it at the normal gutter.

**Body parsing** — keep the existing `parseBody` markdown splitter in `app/article/[slug].tsx`. Add `image` and `keypoints` block types if you want the briefing summary to come from content rather than be derived.

**Reactions** — three equal buttons, h50, radius 15, gap 9: `Sharp`, `Learned something`, `Not sure`. Unselected `#141416`; selected amber on `#1b1206`. Tapping the active one clears it.

**Up next** — header `Up next` 22/700 with a monospace `2 left today` in amber right-aligned. Rows: `#0e0e10`, radius 19, padding 14, 58×58 thumb radius 13, desk word + 16/600 title.

### 5. Desk / section

300px hero image at 60% opacity, scrim to black, desk name 40/800/−2.1 overlaid at bottom-left. Description 17/1.55 muted. Follow button h50 radius 15, full width, amber / `#1c1c20`. Then the same story rows as Today, without the desk word (redundant here).

### 6. Explore (search)

Large title `Explore`. Search field h50 radius 15 `#141416` with a 19px search icon and 17pt input, placeholder *Stories, desks, writers*. Results are 62×62-thumbnail rows. Empty state: `#0e0e10` card radius 22, *Nothing on that yet.* with a paragraph and a `Pitch this story` amber button. Below, a **Trending** list: monospace rank, 17/600 term, and a coloured delta (`+412%`, `New`).

Query: `.or('title.ilike.%q%,standfirst.ilike.%q%')` — as the current `app/(tabs)/explore.tsx` does. Debounce 250ms.

### 7. Saved

Large title, then a `#0b1410` queue card radius 24: eyebrow `READ-LATER QUEUE` in `#7ee0a1`, then *N stories, M minutes* at 23/700, then *Roughly one bus ride. All of it cached for offline.* Rows have a 66×66 thumb and a 34px round `#161618` remove button with an × glyph. Empty state as specified in the prototype.

Backed by the existing `src/lib/bookmarks.ts` AsyncStorage store — no change needed.

### 8. Alerts

Large title with a `Mark all read` amber text button on the baseline. Cards radius 20, padding 18, gap 10. Unread: `#15110b` fill with a 9px `#ff3b30` dot top-right. Read: `#0e0e10`, no dot. Each has a 16.5/600 title, 14.5/1.5 muted body, and a monospace 11.5 timestamp.

### 9. Opportunities

Large title and a one-line description. Cards `#0e0e10` radius 24 padding 22. Top row: type word in its hue, 11.5/700 uppercase; monospace countdown right-aligned, coloured by urgency (`#ff9aa8` under 7 days, `#ffc48f` under 14, faint beyond). Title 21/700/−0.8, body 15.5/1.5 muted, then a meta line and a `Details` button (h38 radius 19, `#1c1c20`).

Data: existing `supabase.from('opportunities').select('*').order('created_at',{ascending:false}).limit(30)`. Derive the countdown from the deadline column client-side.

### 10. Author

76px avatar with initials, name 27/800/−1.3, desk line in `#83adff` 14.5/500. Bio 17/1.58. Follow button. Then a `#0e0e10` radius-20 stat bar with three equal columns (monospace value 21/700, label 12.5 faint). Then recent filings as rows with 60×60 thumbs and monospace stamps.

### 11. Pitch a story

Large title *Pitch a story.* and an explainer. Three fields: a working headline input (h52), a desk picker (wrapping pills h44 radius 22, amber when selected), and a body textarea (h140, radius 15) with a monospace `0/400` counter on its label baseline. Submit button h54 amber; after submit it becomes `#16241c` with `#7ee0a1` text reading *Sent — an editor replies in two days*.

### 12. Profile

64px avatar, name 26/800/−1.2, *Reading since March*, and a 42px round settings button. Then the **streak card**: `#15110b` radius 26 padding 24, eyebrow `CURRENT RUN`, a monospace 52/700/−3 numeral beside *days unbroken* at 17/600, then seven day columns — each a 30-tall bar radius 9 (amber if read, `rgba(255,255,255,0.09)` if not) with a 11.5/600 day letter below.

Three stat cards in a row (`#0e0e10` radius 20): stories read, time reading, saved. Then **What you read most** — four labelled bars, h7 radius 4, filled in the desk hue with a monospace percentage. Then a `Pitch a story` row.

### 13. Settings

Large title. Three grouped lists (`#0e0e10`, radius 18, rows separated by `inset 0 -1px 0 rgba(255,255,255,0.05)`, min-height 54):

- **Notifications** — Morning brief at 07:00 (*One nudge a day, when your five stories are ready.*), Breaking on followed desks, Every story on followed desks (*Off by default. This one gets noisy.*)
- **Reading** — Cache saved stories offline, Haptic feedback, Reduce motion
- **Account** — Signed in as, Interests, Appearance (value rows, 15.5 faint, right-aligned)

**Toggle**: 51×31 track radius 16, knob 27px radius 14 white with the small shadow, `left` 2 → 22, transition 220ms `cubic-bezier(.3,.9,.3,1)`. Track amber when on, `rgba(255,255,255,0.16)` when off. Use the platform `Switch` with `trackColor={{ true: '#ffc48f', false: 'rgba(255,255,255,0.16)' }}`.

Then **Reading layout** — a three-segment control (Immersive / Focus / Briefing) in a `#0e0e10` radius-16 track, each segment h42 radius 12, amber when active. A 13.5 hint line below describes the active choice.

Then **About** — a `Privacy policy` row with a chevron, and a `Sign out` row in `#ff3b30`.

Footer: 44px logo, then *BitBuzz 1.0.0 (24)* / *Built by students, for students.* at 13pt in `rgba(255,255,255,0.26)`.

### 14. Privacy policy

Padding `114 / 22 / 60`. Red eyebrow `BITBUZZ POLICY` (`#ff3b30`), title *Privacy Policy.* at 40/800/−2.2, then *Last updated: 15 September 2026* at 15pt faint.

Eight numbered sections, 32 apart. Section headings 22/700/−0.8; paragraphs 17/1.68 at `rgba(255,255,255,0.8)`, 16 apart. Closing disclaimer above a `line` hairline at 15/1.6 faint.

**The body text is verbatim from the web app** (`The-BitBuzz-Site` → `src/PrivacyPage.tsx`). Do not paraphrase it — it is a published legal notice and the two surfaces must agree. Best practice is to move it to a shared source (a `privacy.md` in a shared package, or a Supabase `pages` row) so one edit updates both web and mobile.

---

## Interactions & behaviour

**Nav bar collapse** — the bar is absolutely positioned above the scroll view, 96 tall. Its opacity is driven by scroll offset:

```
navStart = heroScreen ? 300 : 56          // hero = immersive reader, desk page
opacity  = clamp((scrollY - navStart * 0.45) / (navStart * 0.45), 0, 1)
```

Back/action buttons stay at full opacity throughout — only the material and the title fade. In React Native, drive this with `Animated.event` on `onScroll` and `useNativeDriver: true`.

**Reading progress** — `scrollTop / (scrollHeight - clientHeight)`, clamped to 0–100, driving the 2px hairline under the reader nav.

**Press feedback** — every pressable scales to `0.965` over 180ms on `cubic-bezier(.2,.85,.3,1)`. In React Native use `Pressable` with an `Animated.spring` on `transform: [{ scale }]`. Pair with `Haptics.impactAsync(ImpactFeedbackStyle.Light)`, as the current `ArticleCard` already does.

**Save** — optimistic. Toggle local state, fill the bookmark amber, fire a light haptic, then persist.

**Tab changes** — `Haptics.selectionAsync()`.

**Pitch submit / errors** — `Haptics.notificationAsync(Success | Error)`.

**Notification badge** — `#ff3b30`, minimum 19×19, radius 10, 2.5px ring in the nav background colour so it reads as raised. Monospace numeral, tabular. Hide at zero.

**Navigation map** — Auth → (signin) Today, (signup) Onboarding → Today. Today → Reader, Desk, Explore, Alerts. Reader → Author, next article. Explore empty → Pitch. Profile → Settings, Pitch. Settings → Privacy, Auth (sign out). Auth footer → Privacy.

**Motion not yet built** — worth adding on device: a shared-element transition from feed thumbnail to reader hero, and a spring on the bookmark fill. Both are `react-native-reanimated` territory.

---

## State

Screen-local, no global store needed beyond what exists:

| State | Type | Owner | Persistence |
| --- | --- | --- | --- |
| `session` | Supabase session | root | `supabase.auth` |
| `interests` | `string[]` | root | profile row or AsyncStorage |
| `readerVariant` | `'immersive' \| 'focus' \| 'briefing'` | settings | AsyncStorage |
| `toggles` | notification + reading prefs | settings | AsyncStorage |
| `saved` | `SavedArticle[]` | existing | `src/lib/bookmarks.ts` |
| `briefProgress` | `{ date, readIds[] }` | today | AsyncStorage, reset at 07:00 local |
| `streak` | `number` | profile | derive server-side from a `reading_events` table |
| `scrollY` / `progress` | `number` | per screen | none |
| `authMode`, `authEmail`, `authPassword`, `authConfirm`, `authError`, `authMessage` | | auth | none |

**New tables needed for the habit features** (optional — the UI degrades gracefully without them):

```sql
create table reading_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  article_id uuid references articles not null,
  percent int not null default 0,
  read_at timestamptz not null default now()
);

create table reactions (
  article_id uuid references articles not null,
  user_id uuid references auth.users not null,
  kind text not null,
  primary key (article_id, user_id)
);

alter table profiles add column interests text[] default '{}';
```

Enable RLS on both, with `using (auth.uid() = user_id)` for select/insert. The streak is `count(distinct date(read_at))` over consecutive days; the brief counter is today's rows.

---

## Assets

- **Logo** — `https://cdn.hackclub.com/019eb6cc-8925-7919-8d68-9add6a3d295f/bitbuzz_kids_logo.jpg`, already in `src/constants/theme.ts` as `media.logo`.
- **Desk imagery** — the five Unsplash URLs already in `media` (`space`, `cyber`, `tech`, `aviation`, `innovation`). These are placeholders standing in for real BitBuzz photography and for `cover_image_url` from Supabase. Replace them before shipping.
- **Icons** — drawn as SVG in the prototype at a uniform 1.9px stroke with round caps and joins. In the app use `@expo/vector-icons` Ionicons outline set, which is already a dependency and matches that weight: `newspaper-outline`, `compass-outline`, `sparkles-outline`, `bookmark-outline` / `bookmark`, `person-outline`, `settings-outline`, `search-outline`, `notifications-outline`, `chevron-back`, `chevron-forward`, `share-outline`, `close`, `create-outline`.
- **Fonts** — none to ship. Use the platform system font.
- **Brand marks** — the Apple and Google glyphs on the auth screen are the standard sign-in marks. If you enable those providers, use each vendor's official asset and follow their branding guidelines.

---

---

## Store compliance flows

Three flows exist specifically because App Store Review and Play policy require them. Do not cut them for scope — each one is a hard rejection on its own.

### Guest mode and account gating — Apple 5.1.1(i)

You may not require an account to reach content that does not need one. The app opens **signed out**, on Today, and everything readable stays readable: feed, reader, desks, search, opportunities, privacy policy.

| Action | Signed out |
| --- | --- |
| Read anything | Allowed |
| Save a story | **Allowed** — `bookmarks.ts` is local AsyncStorage, so there is no reason to gate it, and it makes first use feel generous |
| Follow a desk or writer | Sign-in sheet |
| React to a story | Sign-in sheet |
| Pitch a story | Sign-in sheet |
| Streak, brief progress, interests | Hidden; Profile shows a sign-in card instead |

**Sign-in sheet** — a bottom sheet, not a screen. `#18181b`, radius 30 on the top corners only, padding `10 / 20 / 34`, a 38×5 grabber at the top, sliding up over 280ms on `cubic-bezier(.2,.9,.3,1)` behind a `rgba(0,0,0,0.62)` scrim that fades in over 200ms. Tapping the scrim dismisses.

Its headline and body change with the reason, which is the whole point — a generic wall reads as a toll gate, a specific one reads as an explanation:

- **follow** — *Follow this desk?* / "Following puts a desk at the top of your feed and tells you when it publishes. That needs an account to remember."
- **pitch** — *Pitch a story?* / "Pitches go to a real editor, so we need a way to reply to you."
- **react** — *React to this story?* / "Reactions tell editors which stories landed. One account, one vote."

Then Apple, Google and email buttons (h52, radius 15), a *Not now* ghost button, and a footnote: *Reading never needs an account.* with a privacy link.

**Profile when signed out** — the streak card, stat cards and reading mix are all replaced by one amber card: *Keep what you read.* / "Reading works without an account. Sign in to save stories, follow desks, build a streak and pitch to the newsroom." / a *Create a free account* button. Name reads *Reading as a guest*, subtitle *No account needed to read*.

**Sign out returns to Today as a guest**, not to the auth wall. Same principle.

### Report and block — Apple 1.2, Play UGC policy

Required the moment the app carries pitches and reactions. Apple wants three things present: a report mechanism, a way to block abusive users, and published contact details.

A **⋯ button** sits in the reader nav bar, third after bookmark and share — 36px round, same translucent material, three 1.7px dots. It opens the report sheet.

**Report sheet** — same sheet chrome as above.

- Headline *Report this story*, then "Tell us what is wrong with it. Reports are read by a BitBuzz editor, not an automated system."
- Five single-select reason rows: **Inaccurate or misleading**, **Hateful or abusive**, **Spam or advertising**, **Copyright or plagiarism**, **Something else**. Each is a 54-tall row, radius 15, `#242428`, with a 20px radio on the left — 2px ring `rgba(255,255,255,0.28)`, filling amber when selected, and the row fill shifting to `#2a2119`.
- An optional note textarea, h92.
- *Send report* button, inert `#1c1c20` with 30%-opacity text until a reason is picked, then amber.
- A hairline, then a **Block <author>** row in `#ff3b30` with a crossed-circle icon, and beneath it: "Blocking hides every story by this writer from your feed, search and desks. You can undo it in Settings." The label toggles to *Unblock*.
- On submit the sheet swaps to a confirmation: a 52px green check well, *Report sent.*, and "An editor reviews every report. If we take something down you will hear back at the email on your account."

**Backend** — insert into **`bitbuzz_flag_it_reports`**, which already exists and already has an admin queue in `AdminFlagIt.tsx`. Do not create a second reports table. Blocking is client-side to start (an AsyncStorage list of author ids filtered out of every query); promote it to a `blocked_authors` table when accounts sync.

Published contact details — your privacy policy already lists `Hi@Hridhaan.me`. Make sure the App Store Connect support URL resolves to something real.

### Delete account — Apple 5.1.1(v), Play data deletion

Mandatory for any app that lets you create an account. Lives at **Settings → About → Delete account**, in `#ff3b30`, directly under Sign out. Both rows are hidden when signed out.

Full screen, not a dialog:

- Large title *Delete account*, then "This removes your BitBuzz account permanently. It cannot be undone, and we cannot recover it for you afterwards."
- **What gets deleted** — a `#1a0d0c` card, radius 22, red eyebrow, four bulleted rows with 6px red dots: account/email/sign-in method; saved stories, reading history, streak and interests; unpublished pitches; reactions and reports.
- **What stays** — a `#0e0e10` card: "Stories you wrote that BitBuzz has published stay on the site with your byline, because they are part of the published record. If you need a byline changed, email an editor before you delete." This matters editorially and reviewers accept it, but it has to be stated up front, not buried.
- **Typed confirmation** — a monospace input with 2px letter-spacing, placeholder `DELETE`. The destructive button is `#1c1c20` with 30% text until the field reads DELETE (case-insensitive, trimmed), then `#ff3b30` on white.
- A *Keep my account* ghost button below it.
- On confirm: sign out, clear local state, return to Today as a guest.

**Backend — this cannot be done from the client.** Supabase has no client-side user deletion. You need an Edge Function invoked with the user's JWT:

```ts
// supabase/functions/delete-account/index.ts
const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const { data: { user } } = await admin.auth.getUser(jwt);   // verify the caller
if (!user) return new Response('Unauthorized', { status: 401 });

await admin.from('reading_events').delete().eq('user_id', user.id);
await admin.from('reactions').delete().eq('user_id', user.id);
await admin.from('bitbuzz_submissions').delete().eq('author_id', user.id).neq('status','approved');
await admin.from('profiles').delete().eq('id', user.id);
await admin.auth.admin.deleteUser(user.id);
```

The service-role key lives in the function's environment and **must never appear in the app bundle** — anything prefixed `EXPO_PUBLIC_` is readable by anyone who downloads the IPA. Call it with `supabase.functions.invoke('delete-account')`.

Play additionally requires a **web-accessible deletion request URL** listed in the Play Console Data Safety form, even though in-app deletion exists. Add a `/delete-account` route to the site.

### Still outstanding before you submit

Not design work, but they will block the build:

- **`supportsTablet: true` in `app.json`** — reviewers test on iPad and this layout is phone-only. Set it `false` unless you design tablet layouts.
- **Privacy nutrition labels / Data Safety form** — declare email and name at minimum. If any Chanakya AI feature ships in the app, the prompt logging your privacy policy discloses must be declared too. A mismatch between the policy and the form is itself a violation.
- **Age rating** — recommend Teen / 13+, and do **not** enrol in Play's Designed for Families programme. Your own privacy policy acknowledges India's DPDP parental-consent requirements for children's data; Families brings the full compliance load, including restrictions on third-party sign-in for under-13s.
- **Real content** — the article covers are Unsplash placeholders from `theme.ts`. Reviewers reject builds that look like demos.

---

## Backend notes

Read from both repos. Nothing here requires a schema rewrite — most of it is correcting queries the mobile app already makes.

### Bugs in the current mobile queries

**1. Opportunities are unfiltered.** `app/(tabs)/opportunities.tsx` runs:

```ts
supabase.from('opportunities').select('*').order('created_at',{ascending:false}).limit(30)
```

The web app (`OpportunitiesPage.tsx`) filters `.eq('status','approved')`. Note the value is **`approved`**, not `published` — opportunities use a review workflow (`pending` → `approved` / `rejected`, set in `AdminOpportunities.tsx`). As written, the mobile app lists pending and rejected submissions to every reader. Fix:

```ts
supabase.from('opportunities')
  .select('id,title,slug,description,organiser,url,application_url,logo_url,event_type,format,location,start_at,deadline,featured')
  .eq('status','approved')
  .order('featured',{ ascending:false })
  .order('start_at',{ ascending:true, nullsFirst:false })
```

The countdown pill in the redesign reads the **`deadline`** column, which already exists. Compute the remaining time client-side and colour it: under 7 days `#ff9aa8`, under 14 `#ffc48f`, otherwise faint.

**2. The top story should be editorial, not chronological.** `articles` has an **`is_lead`** boolean, and the web home orders `is_lead desc, published_at desc`. The mobile feed orders on `published_at` alone, so the editor's chosen lead is ignored. The redesign's "Top story" card is the lead slot — order by `is_lead` first.

**3. The feed query is missing two columns the new bylines need.** Every card now shows `Author · N min read`. Add `read_minutes` and `profiles(display_name)`:

```ts
.select('id,slug,title,standfirst,cover_image_url,read_minutes,is_lead,published_at,categories(name,slug),profiles(display_name)')
```

`read_minutes` is written on save by the admin (`readingTime(body_md)`), so it is reliable on anything published through the CMS. Fall back to `ceil(words / 220)` if null.

**4. Search is narrower on mobile than on web.** `explore.tsx` matches `title` and `standfirst`; the web `SearchPage.tsx` also matches `body_md`. Match it:

```ts
.or(`title.ilike.%${term}%,standfirst.ilike.%${term}%,body_md.ilike.%${term}%`)
```

Unindexed `ilike` on `body_md` is a sequential scan. Add a trigram index:

```sql
create extension if not exists pg_trgm;
create index articles_search_trgm on articles
  using gin ((title || ' ' || coalesce(standfirst,'') || ' ' || coalesce(body_md,'')) gin_trgm_ops);
```

**5. The `categories` embed comes back as an array sometimes.** The home screen normalises it (`Array.isArray(x.categories) ? x.categories[0] : x.categories`); `explore.tsx` and the article route do not consistently. Normalise in one helper and use it everywhere.

### Auth — the one thing that will break if you skip it

`src/lib/supabase.ts` in the mobile repo creates the client with no storage adapter:

```ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

On web that works because the SDK defaults to `localStorage`. In React Native there is no `localStorage`, so **the session is lost on every app restart**. Before shipping the auth screens:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,   // required on native
  },
});
```

Also call `AppState` start/stop on the auto-refresh timer, per the Supabase Expo guide, or tokens go stale while the app is backgrounded.

**Password reset deep link.** The web app passes `redirectTo: ${window.location.origin}/reset-password`. On mobile use the scheme already declared in `app.json` (`"scheme": "bitbuzz"`):

```ts
supabase.auth.resetPasswordForEmail(email, { redirectTo: 'bitbuzz://reset-password' })
```

Add `bitbuzz://reset-password` and `bitbuzz://auth-callback` to **Authentication → URL Configuration → Redirect URLs** in the Supabase dashboard, or the links silently fail. The same applies to the email-confirmation link for sign-up. You will need a `app/reset-password.tsx` route to receive it.

**OAuth.** Apple and Google are dashboard configuration, not backend code, but they are not drop-in on native: use `expo-apple-authentication` with `signInWithIdToken` for Apple (required by App Store review once you offer any third-party sign-in), and `expo-auth-session` for Google. If you do not want to do that work now, remove both buttons and the divider from the auth screen — email and password alone is a complete flow.

### Things that already exist — do not rebuild them

**Reactions.** There is already a reactions table and an RPC, used by `ArticleReactions.tsx`:

```ts
supabase.rpc('get_article_reaction_counts', { p_article_id: articleId })
```

Wire the reader's three reaction buttons to that RPC and whatever insert the web component uses. Do not create a parallel table.

**Story pitches.** The pitch screen should insert into **`bitbuzz_submissions`**, the same table the web `SubmitPage.tsx` and the ambassador dashboards write to, so pitches land in the existing admin review queue (`Admin.tsx` reads it and sets `status`, `reviewed_by`, `reviewed_at`). Relevant columns: `author_id`, `author_name`, `author_email`, `headline`, `body`, `section`, `status`, `created_at`, optional `publication_id` and `media`. The site also has a `/api/submission-notify` endpoint that emails editors — call it after the insert so mobile pitches notify the same way web ones do.

**Profiles.** `profiles` already carries `display_name`, `bio`, `school`, `avatar_url`, `role`. The author page and profile screen should read those rather than inventing fields. `role` is what gates admin surfaces on web — worth respecting on mobile if you ever add editing.

**Saved articles.** `src/lib/bookmarks.ts` already works and caps at 100. Leave it in AsyncStorage until there is a reason to sync; it is the only feature that works signed-out.

### What genuinely needs adding

Only two things, and both are optional — the UI degrades without them.

```sql
-- reading streak + morning-brief progress
create table reading_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  article_id uuid references articles not null,
  percent int not null default 0,
  read_at timestamptz not null default now()
);
create index reading_events_user_day on reading_events (user_id, read_at desc);

alter table reading_events enable row level security;
create policy "own events" on reading_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- personalised feed
alter table profiles add column if not exists interests text[] default '{}';
```

Streak = count of consecutive distinct `date(read_at)` days ending today. Brief progress = today's distinct `article_id` count, capped at five. Both are cheap enough to compute in a view or an RPC rather than on the client.

### Row-level security

The anon key ships inside the app binary and can be extracted, so RLS is the only real boundary. Confirm a select policy exists on every table the app reads — **including the join targets**, since a missing policy on `categories` or `profiles` does not error, it just nulls the embed and your bylines quietly disappear:

```sql
create policy "public read published" on articles for select using (status = 'published');
create policy "public read approved"  on opportunities for select using (status = 'approved');
create policy "public read" on categories for select using (true);
create policy "public read" on profiles   for select using (true);
```

Restrict `profiles` to the columns you actually want public if `bio`/`school` should not be — use a view.

### Offline

The redesign promises "all of it cached for offline" on the Saved screen. `bookmarks.ts` currently stores metadata only — no `body_md`, so a saved story will not open on a plane. Either store the body at save time or drop that line of copy.

### Realtime

The red badge is static in the prototype. If you want it live, subscribe to inserts on `articles` filtered to the user's interests:

```ts
supabase.channel('new-articles')
  .on('postgres_changes', { event:'INSERT', schema:'public', table:'articles', filter:'status=eq.published' }, handler)
  .subscribe()
```

Otherwise refresh the count on focus, which the app already does via `useFocusEffect`.

### Environment

```
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
```

The `EXPO_PUBLIC_` prefix is what inlines them into the bundle. Restart with `npx expo start -c` after changing them. `.env` is not uploaded to EAS — add both to each profile in `eas.json`. Never put the service-role key in the app.

## Files in this bundle

| File | What it is |
| --- | --- |
| `BitBuzz Mobile v2.dc.html` | The full prototype — all fifteen screens plus the two bottom sheets, interactive. Open it in a browser. Screen logic lives in the `<script data-dc-script>` block at the bottom; the markup above it carries every style value quoted in this document. |
| `ios-frame.jsx` | The device bezel used only for presentation. No app counterpart. |

## Source repositories

- `hridhaan-s/The-BitBuzz-MobileApp` @ `main` — the app this redesigns. Screens in `app/`, components in `src/components/`, tokens in `src/constants/theme.ts`.
- `hridhaan-s/The-BitBuzz-Site` @ `main` — read for `src/AuthPage.tsx` (auth flow and validation copy) and `src/PrivacyPage.tsx` (policy text). Not modified.

# Analytics

## Setup and configuration

In Google Analytics, open Admin → Data streams → your Web stream (or create a Web stream for `https://sanfor2004.github.io`). Copy its Measurement ID, beginning `G-`. Reuse the existing property to preserve reporting continuity.

For local configuration, copy [.env.example](../.env.example) to `.env` and set:

```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace the example with your real ID. `.env` is ignored. The previous implementation's ID was `G-7B8D7CCSRQ`; use that value if it is still your intended stream. The ID is public configuration, not an account credential.

For deployment, go to GitHub repository Settings → Secrets and variables → Actions → Variables → New repository variable. Set `PUBLIC_GA_MEASUREMENT_ID` to your ID. [deploy.yml](../.github/workflows/deploy.yml) passes this variable into the build. Changing a variable requires a new build/deployment. No default ID is embedded in source.

`npm run dev` never loads GA. `npm run build` and `npm run preview` enable it only for a nonempty valid ID. Use a separate test stream for preview so local sessions do not enter production reports. Missing/malformed IDs leave the site operational and do not request Google's script.

## Avoid duplicate page views

This site uses Astro ClientRouter. [Analytics.astro](../src/components/Analytics.astro) enables the [analytics helper](../src/lib/analytics.ts), which loads the Google tag once and configures `send_page_view: false`. It sends one explicit page view on `astro:page-load`, including direct loads, internal navigation, and back/forward. Repeated initialization for the same main element is ignored.

**Required property setting:** Admin → Data streams → Web stream → Enhanced measurement settings → Page views → Show advanced settings → disable **Page changes based on browser history events**. Save. Alternatively, disable Enhanced measurement entirely if using only this site's explicit events. Do not install another GA tag through a second integration.

Google explains why manual page views require disabling automatic history measurement in its [page-view documentation](https://developers.google.com/analytics/devguides/collection/ga4/views). Review other [Enhanced measurement events](https://support.google.com/analytics/answer/9216061) before enabling them; they collect additional data beyond this helper.

## Tracked actions

| Event | Trigger | Parameters |
| --- | --- | --- |
| `page_view` | Each completed page navigation | Canonical page URL, document title, sanitized referrer |
| `article_view` | Blog article opened | Authored article slug |
| `project_view` | Project detail opened | Authored project slug |
| `outbound_github_click` | GitHub link clicked | GitHub origin and path, no query or fragment |
| `linkedin_click` | LinkedIn link clicked | Fixed `linkedin` destination |
| `contact_click` | Internal contact link clicked | None |

There is no newsletter, résumé link, or live tool in this checkout, so no corresponding events are emitted. Calls use `trackEvent(name, parameters)` and fail silently if analytics is unavailable. Add events only for real features, keeping the typed parameter list narrow.

## Verify after deployment

1. Confirm the Pages deployment succeeds and inspect production HTML for `sanfor-ga-id` containing the intended ID.
2. Open production with blockers disabled for the test. Open GA Realtime and confirm your session appears.
3. Open a project, then an article through an internal link. Use Back and Forward. Confirm one `page_view` per completed navigation and the matching content event.
4. Click GitHub, LinkedIn, and Contact links and confirm the named events in Realtime.
5. For detailed testing use Google Tag Assistant to enable debugging, or run `window.gtag('set', {debug_mode: true})` in the browser console and navigate internally. Inspect Admin → DebugView. Reload after removing manual debugging. See [Google's DebugView guidance](https://support.google.com/analytics/answer/7201382).
6. In browser DevTools, inspect the dataLayer or collection requests. URLs should have no query strings/fragments; forms and blog search text must not appear. Ad blockers may prevent delivery even when queued events are correct.

Local automated checks intercept Google's script; they verify event generation without transmitting test traffic. They cannot prove collection by your Google account. Realtime/DebugView verification remains an owner action after deployment.

## Privacy and future consent

Track actions, not entered content. Never add email addresses, phone numbers, message bodies, names from forms, or search input to events. Page locations come from static canonicals; the initial external referrer is reduced to its origin, and later referrers are canonical site URLs. The helper does not access localStorage and disables Google Signals in its config.

No consent banner is introduced. If consent-based loading is needed, gate the call to `initializeAnalytics()` on the consent decision before creating the Google script or dataLayer. Keep consent state separate from page lifecycle handling; revoke/disable collection through the chosen consent implementation. No claims of legal compliance are made by these technical defaults.

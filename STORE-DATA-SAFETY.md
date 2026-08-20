# PS Laser — Google Play Data Safety preparation (INTERNAL)

**Not a public page.** This is a reference document for transcribing answers into the
Google Play Console → App content → Data safety form by hand. Every row below is grounded
in a direct audit of the actual codebase (Firestore rules, Cloudflare Worker routes, and
Flutter client code) — nothing here is guessed.

Do not submit this to Play Console automatically; that step is explicitly left to you.

---

## Data types collected

| Data type | Collected? | Shared with 3rd party? | Purpose | Optional/Required | Retention | Deletable on request? | Encrypted in transit |
|---|---|---|---|---|---|---|---|
| Name (employee) | Yes | No (Firebase/Cloudflare are infrastructure processors, not data recipients) | App functionality, account management | Required | Indefinite while employed; see note below | Partially — see [Known gap](#known-gap-account-deletion) | Yes (HTTPS/TLS) |
| Employee role, department, shift | Yes | No | App functionality, access control | Required | Indefinite | Partially | Yes |
| PIN (hashed, scrypt) | Yes | No | Authentication | Required | Indefinite while account active | Partially | Yes |
| Security question/answer (hashed) | Yes | No | Account recovery | Required | Indefinite while account active | Partially | Yes |
| Customer/client name, phone, email, address, GST | Yes | No | App functionality (order management) | Required (for order-taking) | Indefinite — business/financial record | **No** — orders/clients are permanently retained by design | Yes |
| Order data (items, pricing, dates) | Yes | No | App functionality | Required | Indefinite — business/financial record | No | Yes |
| Order reference photos | Yes | No (Backblaze B2 / Google Drive are storage processors, not recipients) | App functionality | Optional | Active tier 0–90 days, then archived indefinitely | Only via the (currently non-cascading) delete-attachment path | Yes |
| Device push token (FCM) | Yes | Yes — Google (Firebase Cloud Messaging) as the notification delivery service | Push notifications | Required for notifications, app otherwise functions without | Until account/device unlinked | Yes (deleted on logout for that device) | Yes |
| Chat messages sent to AI assistant | Yes | Yes — OpenRouter (LLM inference provider) | AI assistant feature | Optional (feature is opt-in by use) | Stored in Firestore (`aiConversations`) indefinitely unless the user deletes a conversation in-app | User-manageable in-app | Yes |
| Crash logs | Yes (release builds only) | Yes — Google (Firebase Crashlytics) | Bug fixing / app stability | N/A (automatic, not user data entry) | Per Google Crashlytics' own retention (not configured by us) | N/A | Yes |
| Precise/approximate location | **No** | — | — | — | — | — | — |
| Photos/videos (general camera roll access beyond order photos) | **No** | — | — | — | — | — | — |
| Advertising ID | **No** | — | — | — | — | — | — |
| Analytics/usage data (behavioral tracking) | **No** — no analytics SDK of any kind is present in the app | — | — | — | — | — | — |

## Security practices to answer in the form

- **Data encrypted in transit**: Yes — all Firestore/FCM/Worker traffic is HTTPS/TLS.
- **Data encrypted at rest**: Yes, via the underlying providers' own at-rest encryption (Firestore, Backblaze B2, Google Drive all encrypt at rest by default) — PINs and security answers are additionally one-way hashed (scrypt) before storage, so even at-rest access cannot recover the original value.
- **Users can request data deletion**: Partially — see [Known gap](#known-gap-account-deletion) below. Answer this honestly as "provides a way for users to request that their data be deleted" (the email-based request path in `/delete-account`), **not** "account and associated data is deleted upon user request within the app" — that stronger claim is not yet true.
- **Committed to Play Families Policy**: N/A (not a Families app / not directed at children).
- **Independent security review**: No third-party security audit has been performed (state accurately — do not claim one exists).

## Known gap: account deletion

Confirmed by direct code/rules audit (2026-08-20): the in-app "Delete My Account" button
(`lib/features/settings/settings_hub_screen.dart`) calls a Firestore delete that is rejected
by `firestore.rules` (`allow delete: if false` on `employees/{id}`, unconditional — no
exception for self-delete). Even if that rule were relaxed, nothing in the codebase today
deletes the underlying Firebase Auth user, the `employees/{id}/private/credentials`
subcollection, `fcmTokens`, or `aiConversations`. There is no server-side (Cloudflare Worker)
deletion endpoint at all.

**Required before this form can honestly claim in-app self-service deletion works:**
1. A new Cloudflare Worker route (e.g. `/deleteAccount`) that, authenticated as the calling
   user, deletes the Firebase Auth user via the Identity Toolkit API and cascades through
   Firestore: the `employees/{id}` doc, its `private/credentials` subdoc, all `fcmTokens`
   docs for that employee, and `aiConversations` (+`messages`) owned by that employee.
2. A `firestore.rules` change allowing this specific, narrowly-scoped server-authenticated
   deletion path (the client SDK should still never be allowed to delete `employees/{id}`
   directly — the Worker uses the service account, which already bypasses rules).
3. A decision on whether "delete" here means hard-delete or anonymize-and-retain for the
   employee's *own* profile fields, while still leaving their name attached to historical
   order/production records they can't be retroactively scrubbed from (a real, disclosed
   trade-off — see `/privacy` and `/delete-account` on the website).

Until this ships, the honest Play Console answer is: **"Users can request that their data be
deleted, but not entirely within the app yet"** — with the web `/delete-account` page as the
request mechanism, matching what the website already discloses.

## Contact / Developer identity fields (fill in when submitting)

- Developer name: PS Laser
- Support email: pslaser24@gmail.com
- Privacy Policy URL: `https://gandharv2323.github.io/PS-LASER-APP-WEB/privacy`
- Website: `https://gandharv2323.github.io/PS-LASER-APP-WEB/`

(Deploy target: GitHub Pages, this repo — see `README.md`'s "Deploy" section for the
one-time Settings → Pages setup required before this URL actually goes live.)

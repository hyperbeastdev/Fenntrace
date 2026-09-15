# Fenntrace

**Understand where your personal data has surfaced.**

Fenntrace is a privacy-first personal data exposure checker. It helps people understand whether their email address appears in known data-breach records, what categories of information were exposed, how serious the exposure is, and what actions they can take next. 

## Live Demo

🔗 **Live application:** https://fenntrace.vercel.app

🎥 **Demo video:** -

## Why Fenntrace?

People often hear that their information has been exposed but don't know:
* where it appeared
* what information was exposed
* how serious the exposure is
* what they should do next

Fenntrace turns that uncertainty into an understandable investigation. It translates complex security alerts into a clear, actionable summary designed for human beings, not just cybersecurity experts.

## What Fenntrace does

### Check
A user enters an email address they want to investigate.

### Discover
Fenntrace checks the available exposure records for the provided email address.

### Understand
Results are presented through a chronological exposure timeline, severity levels (e.g., Critical, Elevated Risk), and specific exposed-data categories (like passwords, phone numbers, or physical addresses).

### Act
Recommended actions translate the findings into practical, prioritized next steps to help secure the user's digital footprint.

## Product highlights

* **Email exposure checking:** Fast, session-based querying of exposure records.
* **Exposure timeline:** Visual chronological breakdown of when breaches occurred.
* **Severity classification:** Highlights the level of risk associated with the exposed data.
* **Exposed data-type indicators:** Clearly flags what specific data points (passwords, usernames, phone numbers) were compromised.
* **Recommended security actions:** Actionable steps tailored to the severity of the exposure.
* **Session-based result handling:** Results are transient and tied to the active browser session.
* **Ability to clear the investigation:** Users can explicitly "Erase this check" to clear results from their screen instantly.
* **Responsive interface:** Fully functional and polished on mobile, tablet, and desktop.
* **Privacy-focused UX:** Dark-themed, calm, and constrained interface that prioritizes readability over panic.

## User experience

Privacy is a product UX problem, not just a legal footnote. Fenntrace intentionally avoids making the user navigate a complicated cybersecurity dashboard filled with alarming red alerts and technical jargon.

The interface focuses on:
* clarity
* hierarchy
* restrained visual language
* meaningful severity signals
* actionable information
* privacy transparency

The overall journey is simple:
`Enter email → Check exposure → Review findings → Understand risk → Take action`

## Privacy by design

Fenntrace respects the user's privacy through the entire investigation lifecycle.

* **Transmission:** The email address is only used to query the underlying exposure records.
* **Storage:** Fenntrace does **not** store the email address, search history, or investigation results in any database. 
* **Browser state:** Results exist purely in the React application state during the active session. No data is written to `localStorage` or `sessionStorage`.
* **Prototype constraints:** The current implementation runs on a controlled demo exposure dataset for the purposes of this prototype. It is designed to demonstrate the user experience of querying and understanding exposure, rather than functioning as a live, internet-wide API integration.

## Investigation report

After an exposure check, the user is presented with a detailed report structure:

* **Number of exposure records:** A clear count of how many times the email was found.
* **Severity indication:** An overall risk assessment based on the sensitivity of the data exposed.
* **Breach timeline:** A chronological list of specific data breaches.
* **Affected data categories:** Badges indicating what data was compromised (Email, Password, Username, Phone, Address).
* **Individual exposure records:** Detailed cards for each breach, explaining what happened and what data was involved.
* **Recommended actions:** A prioritized checklist of steps to take.
* **Methodology explanation:** A "How this check works" card providing transparency into the process.
* **Erase function:** A prominent button to clear the current investigation and return to the home screen.

## Technology

* **Next.js 15 (App Router):** For React framework orchestration, routing, and fast performance.
* **React 19:** For component state management and UI rendering.
* **TypeScript:** For end-to-end type safety.
* **Tailwind CSS v4:** For utility-first styling and a constrained design system.
* **shadcn/ui:** For accessible, customizable, and high-quality UI primitives.
* **Lucide Icons:** For clean, consistent iconography.

This stack was chosen because it allows for rapid prototyping while maintaining production-grade performance, accessibility, and visual polish out of the box.

## Project structure

```text
app/                  # Next.js App Router layout, pages, and global CSS
components/           # Reusable UI components (header, footer, buttons, inputs)
  ui/                 # shadcn/ui primitive components
demo/                 # Controlled dataset and simulated API logic for the prototype
features/check/       # Core business logic, custom hooks, and state management for exposure checks
domain/               # TypeScript interfaces and domain models for exposure records
lib/                  # Utility functions (e.g., Tailwind class merging)
public/               # Static assets (logos, images, favicons)
```

## Getting started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm, yarn, pnpm, or bun

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3001) with your browser to see the result. (If port 3000 is in use, Next.js will automatically select an alternative port such as 3001).

## Environment variables

Fenntrace supports both live breach intelligence and offline realistic modes:

```env
# Have I Been Pwned API Key (Optional for live internet-wide breach queries)
HIBP_API_KEY=

# Provider Mode ("auto" | "hibp" | "local")
FENNTRACE_PROVIDER=auto

# Rate Limiting Configuration (requests per client IP)
RATE_LIMIT_MAX=15
RATE_LIMIT_WINDOW_MS=60000
```

## Backend Architecture & API Routes

Fenntrace features a production-ready Next.js App Router backend with built-in privacy safeguards and abuse prevention:

* **`POST /api/check`**: Primary exposure investigation endpoint. Applies rate limiting, zero-log masking, queries the active provider (HIBP live v3 or Local Breach Engine), calculates threat risk level, and generates a prioritized remediation action plan.
* **`POST /api/check-password`**: Privacy-preserving **k-Anonymity** password exposure check using the HIBP Pwned Passwords range API (receives 5-character SHA-1 hash prefix; passwords and full hashes never leave the client).
* **`GET /api/breaches`**: Catalog of indexed breaches with breach statistics, data category breakdowns, and severity tiers.
* **`GET /api/health`**: System status and active breach provider diagnostic information.

### Security & Privacy Protections
* **In-memory Sliding Window Rate Limiting**: Prevents bot scrapers and brute-force email status enumeration.
* **Zero Data Retention**: Zero persistence of queried emails, with standard `no-store, no-cache` headers to prevent intermediary CDN/browser caching.
* **Safe Log Sanitization**: Emails are masked (e.g. `al***a@example.com`) in server execution logs.

## Architecture / Flow

```text
User
  ↓
Enter email address on Landing Page
  ↓
Submit form (triggers client HttpExposureProvider)
  ↓
POST /api/check (Server Route with Sliding-Window Rate Limiting)
  ↓
Exposure Provider Factory (Live HIBP v3 API or Local Breach Intelligence)
  ↓
Data Category & Severity Classification Mapper
  ↓
Domain Risk & Remediation Derivation
  ↓
Return Sanitized Exposure Analysis (zero log persistence)
  ↓
Render Investigation Report (replaces Landing Page)
  ↓
User reviews Prioritized Actions or clicks "Erase this check" (resets state)
```

## Future Direction

* **Continuous exposure monitoring:** Allowing users to opt-in to alerts when new exposures are discovered.
* **Richer remediation workflows:** Deep-linking directly to service provider password-reset pages or account deletion forms.

## Hackathon Context

Fenntrace demonstrates a superior, privacy-first user experience and robust architecture for personal data exposure checking. It focuses on design, interaction, transparency, and production-ready engineering for everyday people.

## License

MIT License.


# Fenntrace

**Understand where your personal data has surfaced.**

Fenntrace is a privacy-first personal data exposure checker. It helps people understand whether their email address appears in known data-breach records, what categories of information were exposed, how serious the exposure is, and what actions they can take next. 

## Live Demo

🔗 **Live application:** [ADD VERCEL URL HERE]

🎥 **Demo video:** [ADD DEMO VIDEO URL HERE]

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. (If port 3000 is in use, Next.js will automatically select an alternative port such as 3001).

## Environment variables

No environment variables are required for the current demo configuration. The prototype runs entirely locally without requiring external API keys.

## Architecture / flow

```text
User
  ↓
Enter email address on Landing Page
  ↓
Submit form (triggers transient React state)
  ↓
Simulate network request (demo dataset)
  ↓
Return Exposure Analysis (records, severity, types)
  ↓
Render Investigation Report (replaces Landing Page)
  ↓
User reviews Recommended Actions
  ↓
User clicks "Erase this check" (resets state)
```

## Current limitations

As a hackathon prototype, Fenntrace currently has the following limitations:

* **Demo dataset:** The current implementation uses a controlled, static dataset for demonstration purposes. 
* **Not an internet-wide scanner:** It is not a live integration with HaveIBeenPwned or similar APIs and is not a guarantee of complete internet-wide exposure detection.
* **Absence of a record:** A "clean" result in this prototype does not prove that an email has never been exposed in the real world.
* **No authentication:** It is not an identity or authentication system.
* **Not professional advice:** Results and recommendations are illustrative and are not intended to be a substitute for professional cybersecurity investigation or incident response.

## Future direction

* **Live breach intelligence integrations:** Connecting the frontend to real-world APIs (e.g., HIBP, DeHashed).
* **Continuous exposure monitoring:** Allowing users to opt-in to alerts when new exposures are discovered.
* **Stronger privacy-preserving lookups:** Implementing k-Anonymity or localized hashing so the raw email is never transmitted to the server.
* **Richer remediation workflows:** Deep-linking directly to service provider password-reset pages or account deletion forms.

## Hackathon context

Fenntrace was built as a prototype for a hackathon. The goal of the project is to demonstrate a superior, privacy-first user experience for personal data exposure checking. It focuses heavily on design, interaction, and frontend architecture to present a vision of how security tools should feel for everyday people.

## License

TODO: Add license information.

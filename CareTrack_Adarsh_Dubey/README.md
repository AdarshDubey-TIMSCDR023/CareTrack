# CareTrack — Industry UI Upgrade

Responsive React + Vite prototype for a quarantine/treatment facility. This version emphasizes role-specific workspaces and a more developed patient-facing portal.

## Role experiences

- **Patient / Normal User:** personal care space, personal progress placeholder, profile, follow-up request interaction, daily check-in interaction, privacy messaging and education guidance. It does not expose facility-wide patient lists or clinical write controls.
- **Nurse:** vitals and observation workflow, patient queue, temperature recording, duplicate same-day temperature guard, task coverage indicators.
- **Doctor:** clinical review queue, patient detail view, visit notes, visit-after-temperature validation, discharge review workflow.
- **Admin:** facility occupancy (74-patient capacity), patient registration, duplicate room guard, discharge management and CSV export.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

For a production bundle:

```bash
npm run build
npm run preview
```

## Demo accounts

Password for the seeded demo accounts: `caretrack123`

- Nurse: `nurse@caretrack.demo`
- Doctor: `doctor@caretrack.demo`
- Admin: `admin@caretrack.demo`
- Patient / Normal User: `user@caretrack.demo`

## Prototype boundaries

- Data is stored in the browser's local storage. This is not secure storage and is not suitable for real patient information.
- Demo sign-up and password reset are local-only; password recovery does not send email and passwords are not protected by a server.
- Patient follow-up requests and check-ins are local demo interactions; they do not notify a real care team.
- Patient accounts are not linked to verified medical records in this prototype.
- The three-day fever-free/discharge logic is a workflow demonstration only, not a medical determination. Clinical policy and a qualified clinician must determine discharge readiness.
- Before production, implement server-side authentication, role-based authorization, secure password reset, audit logs, encrypted storage, verified patient-account linking, backups, and privacy/security review.

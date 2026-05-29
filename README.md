# GrowthAgent OS

> AI agents that turn enquiries into qualified sales opportunities.

GrowthAgent OS is a premium AI operations platform for digital businesses. Each customer gets a private lead CRM, AI lead-to-sale agent, approval queue, agent chat, and reports — all from one dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Auth | Auth.js v4 (email/password) |
| Validation | Zod + React Hook Form |
| Billing | Stripe-ready architecture |
| Icons | Lucide React |

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd growth-agent-os
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/growthagent_os"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-min-32-chars"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Set up the database

```bash
# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed with demo data + test accounts
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Accounts

After running `npm run db:seed`:

| Role  | Email                  | Password     |
|-------|------------------------|--------------|
| Admin | admin@growthagent.os   | admin123456  |
| User  | demo@example.com       | demo123456   |

The demo account has a pre-configured company (Acme Digital Agency) with 6 seeded leads, 3 pending approvals, and 5 agent run logs.

---

## Routes

### Public

| Route      | Description               |
|------------|---------------------------|
| `/`        | Premium homepage          |
| `/pricing` | Pricing page (3 tiers)    |
| `/demo`    | Demo request form         |
| `/login`   | Sign in                   |
| `/signup`  | Create account            |

### App (requires authentication)

| Route              | Description                          |
|--------------------|--------------------------------------|
| `/app`             | Main dashboard                       |
| `/app/leads`       | CRM lead list with scoring           |
| `/app/leads/[id]`  | Lead detail: research, draft, action |
| `/app/agent`       | Agent chat interface                 |
| `/app/approvals`   | Approval queue                       |
| `/app/reports`     | Pipeline reports                     |
| `/app/settings`    | Company, agent, integrations         |
| `/app/onboarding`  | Post-signup setup wizard             |

### Admin (requires `ADMIN` role)

| Route                | Description              |
|----------------------|--------------------------|
| `/admin`             | Platform overview        |
| `/admin/customers`   | Customer list + MRR      |
| `/admin/leads`       | All leads across accounts|
| `/admin/agent-runs`  | Agent execution logs     |

---

## Environment Variables

| Variable                 | Required | Description                       |
|--------------------------|----------|-----------------------------------|
| `DATABASE_URL`           | ✅ Yes   | PostgreSQL connection string      |
| `NEXTAUTH_URL`           | ✅ Yes   | App base URL                      |
| `NEXTAUTH_SECRET`        | ✅ Yes   | Auth signing secret (32+ chars)   |
| `STRIPE_SECRET_KEY`      | No       | Stripe secret key (billing)       |
| `STRIPE_PUBLISHABLE_KEY` | No       | Stripe publishable key            |
| `STRIPE_WEBHOOK_SECRET`  | No       | Stripe webhook signing secret     |
| `NEXT_PUBLIC_APP_URL`    | No       | Public app URL                    |

---

## Database Commands

```bash
npm run db:migrate   # Run migrations in dev
npm run db:push      # Push schema (no migration file)
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:generate  # Regenerate Prisma client
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/            # Login + signup pages
│   ├── (public)/          # Marketing pages (homepage, pricing, demo)
│   ├── app/               # Authenticated app pages
│   │   ├── page.tsx       # Dashboard
│   │   ├── leads/         # CRM leads list + detail
│   │   ├── agent/         # Agent chat
│   │   ├── approvals/     # Approval queue
│   │   ├── reports/       # Reports
│   │   ├── settings/      # Settings (6 tabs)
│   │   └── onboarding/    # Post-signup wizard
│   ├── admin/             # Admin-only area
│   ├── api/               # API routes (auth, signup)
│   └── actions/           # Server actions (auth, approvals)
├── components/
│   ├── ui/                # shadcn/ui component library
│   └── layout/            # Navbar, footer, sidebar, providers
├── lib/
│   ├── auth.ts            # NextAuth options + CredentialsProvider
│   ├── db.ts              # Prisma client singleton
│   ├── utils.ts           # cn(), formatCurrency, formatDate, colour helpers
│   └── validations.ts     # Zod schemas
└── types/
    └── next-auth.d.ts     # Session/JWT type augmentation
prisma/
├── schema.prisma          # 18 models, 8 enums
└── seed.ts                # Demo data seed script
```

---

## Pricing Structure

| Plan                | Setup Fee    | Monthly     |
|---------------------|--------------|-------------|
| Lead Agent Starter  | £499         | £99/month   |
| Pipeline Agent      | £1,500       | £249/month  |
| Growth Agent OS     | from £3,000  | from £599/month |

---

## Database Schema

18 Prisma models across 8 categories:

- **Auth**: `User`, `Account`, `Session`, `VerificationToken`
- **Business**: `Company`, `CompanyMember`, `Plan`, `Subscription`
- **CRM**: `Lead`, `LeadNote`, `LeadScore`
- **Agents**: `Agent`, `AgentMessage`, `AgentTask`, `AgentRun`
- **Workflow**: `ApprovalRequest`, `Integration`, `Report`
- **System**: `AuditLog`, `VoiceCall`, `WebhookEvent`

---

## Phase 2 Roadmap

These features are architecturally ready but not yet wired to live data:

- [ ] Live database queries replacing mock data on all pages
- [ ] OpenClaw agent engine integration
- [ ] Stripe checkout + subscription management
- [ ] AI lead research (OpenAI / Perplexity API)
- [ ] Gmail integration for email enquiry capture
- [ ] HubSpot / Pipedrive two-way sync
- [ ] Vapi voice agent for inbound calls
- [ ] Real-time notifications (Pusher or SSE)
- [ ] Email delivery via Resend
- [ ] Webhook receiver for external lead sources

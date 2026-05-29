# GrowthAgent OS

> AI agents that turn enquiries into qualified sales opportunities.

GrowthAgent OS is a premium AI operations platform for digital businesses. It gives each customer a private lead CRM, AI lead-to-sale agent, approval queue, agent chat, and reports — all from one dashboard.

## Tech Stack

- **Next.js 14** App Router
- **TypeScript**
- **Tailwind CSS** + shadcn/ui
- **Prisma ORM** + PostgreSQL
- **Auth.js v4** (email/password)
- **Stripe-ready** subscription architecture
- **Zod** validation + React Hook Form

## Quick Start

### 1. Clone and install

```bash
git clone <repo>
cd growth-agent-os
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/growthagent_os"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-min-32-chars"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 3. Set up the database

```bash
# Create tables
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed with demo data
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

After seeding:

| Role  | Email                    | Password      |
|-------|--------------------------|---------------|
| Admin | admin@growthagent.os     | admin123456   |
| User  | demo@example.com         | demo123456    |

## Routes

### Public
| Route      | Description          |
|------------|----------------------|
| `/`        | Homepage             |
| `/pricing` | Pricing page         |
| `/demo`    | Demo request form    |
| `/login`   | Sign in              |
| `/signup`  | Create account       |

### App (authenticated)
| Route                | Description          |
|----------------------|----------------------|
| `/app`               | Main dashboard       |
| `/app/leads`         | CRM lead list        |
| `/app/leads/[id]`    | Lead detail          |
| `/app/agent`         | Agent chat           |
| `/app/approvals`     | Approval queue       |
| `/app/reports`       | Reports              |
| `/app/settings`      | Settings             |
| `/app/onboarding`    | Post-signup setup    |

### Admin (ADMIN role only)
| Route                  | Description         |
|------------------------|---------------------|
| `/admin`               | Admin overview      |
| `/admin/customers`     | Customer list       |
| `/admin/leads`         | All leads           |
| `/admin/agent-runs`    | Agent run logs      |

## Environment Variables

See `.env.example` for all required variables.

| Variable               | Required | Description                    |
|------------------------|----------|--------------------------------|
| `DATABASE_URL`         | Yes      | PostgreSQL connection string   |
| `NEXTAUTH_URL`         | Yes      | App URL                        |
| `NEXTAUTH_SECRET`      | Yes      | Auth signing secret (32+ chars)|
| `STRIPE_SECRET_KEY`    | No       | Stripe secret key              |
| `STRIPE_PUBLISHABLE_KEY` | No     | Stripe publishable key         |
| `STRIPE_WEBHOOK_SECRET`  | No     | Stripe webhook signing secret  |

## Database Migrations

```bash
# Run migrations in development
npx prisma migrate dev

# Deploy migrations in production
npx prisma migrate deploy

# Open Prisma Studio
npm run db:studio
```

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public marketing pages
│   ├── (auth)/            # Login/signup pages
│   ├── app/               # Authenticated app pages
│   ├── admin/             # Admin-only pages
│   ├── api/               # API routes
│   └── actions/           # Server actions
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Shared layout components
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── db.ts              # Prisma client
│   ├── utils.ts           # Utility functions
│   └── validations.ts     # Zod schemas
└── types/
    └── next-auth.d.ts     # Type augmentations
```

## What's Next (Phase 2)

- [ ] Wire real leads from database (currently uses mock data)
- [ ] Connect OpenClaw agent engine
- [ ] Stripe checkout integration
- [ ] Real AI lead research (Perplexity / OpenAI)
- [ ] Gmail / HubSpot integrations
- [ ] Vapi voice agent
- [ ] Real-time notifications (Pusher / SSE)
- [ ] Email delivery (Resend)

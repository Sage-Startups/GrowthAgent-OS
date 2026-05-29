# Security Model

GrowthAgent OS is built on an approval-first security model. No sensitive action happens without explicit operator sign-off.

## Approval-First Principle

Every action that touches external parties or changes CRM data goes through the approval queue before execution:

| Action | Approval Required |
|--------|------------------|
| Send email to lead | Yes (`DRAFT_EMAIL`) |
| Change lead CRM status | Yes (`CRM_STATUS_CHANGE`) |
| Schedule follow-up | Yes (`FOLLOW_UP`) |
| Book a call | Yes (`BOOK_CALL`) |
| Send proposal | Yes (`SEND_PROPOSAL`) |
| Make outbound voice call | Yes (`BOOK_CALL`) |
| Delete lead | Yes (`DELETE_LEAD`) |
| Export data | Yes (`EXPORT_DATA`) |

## Data Isolation

- Each company's data is isolated by `companyId`
- All queries are scoped to the authenticated user's company
- No cross-company data access is possible via the API
- Company membership is verified on every authenticated request

## API Key Security

- API keys are stored as plain strings but are long random UUIDs (`gao_...`)
- Keys are shown masked in the UI by default
- Keys can be regenerated at any time, invalidating the previous key
- All webhook endpoints accept keys via the request body (not URL)

## Audit Logging

Every agent action, approval, and configuration change is recorded in the `AuditLog` table:

```typescript
prisma.auditLog.create({
  data: {
    companyId,
    userId,
    action: "ACTION_NAME",
    entityType: "Lead",
    entityId: lead.id,
    metadata: { ... },
  },
})
```

Operators can view the last 10 audit events in Settings → Security.

## Webhook Security

All inbound webhooks validate a shared secret:

- Lead webhook: `x-api-key` or `companyApiKey` in body
- Voice webhooks: `x-webhook-secret` header
- Stripe webhooks: Stripe signature validation

Invalid requests return `401 Unauthorized` immediately.

## Rate Limiting

TODO: Implement rate limiting on webhook endpoints using a Redis-backed token bucket or upstash/ratelimit. Priority: medium.

## Session Security

- NextAuth sessions are signed with `NEXTAUTH_SECRET`
- Sessions expire after 30 days
- Passwords are hashed with bcrypt (12 rounds)
- No plaintext passwords stored

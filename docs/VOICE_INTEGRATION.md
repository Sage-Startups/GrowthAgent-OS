# Voice Integration

GrowthAgent OS supports voice agent capabilities for browser-based queries and inbound phone calls.

## Requirements

- Growth Agent OS plan required
- Voice provider configured (Vapi or Twilio)
- `VOICE_WEBHOOK_SECRET` set for webhook security

## Supported Providers

### Vapi

Vapi provides browser-based voice and inbound call routing via AI assistants.

```env
VOICE_PROVIDER=vapi
VAPI_API_KEY=your_vapi_api_key
VAPI_ASSISTANT_ID=asst_your_assistant_id
VOICE_WEBHOOK_SECRET=your_webhook_secret
```

Webhook URL to configure in Vapi: `POST /api/voice/vapi`

### Twilio

Twilio provides PSTN telephony with programmable voice.

```env
VOICE_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+441234567890
VOICE_WEBHOOK_SECRET=your_webhook_secret
```

Webhook URL to configure in Twilio: `POST /api/voice/twilio`

### Local (Development)

Default provider. Creates mock sessions. No real calls.

```env
VOICE_PROVIDER=local
```

## Webhook Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/voice/webhook` | Generic inbound — provider-agnostic |
| `POST /api/voice/vapi` | Vapi-specific call events |
| `POST /api/voice/twilio` | Twilio status callbacks (TwiML) |

## Security

All voice webhooks validate the `x-webhook-secret` header against `VOICE_WEBHOOK_SECRET`. Requests without the correct secret return `401 Unauthorized`.

## VoiceCall Records

Every call creates a `VoiceCall` record with:

- Direction: `INBOUND` / `OUTBOUND` / `BROWSER`
- Provider name
- Phone number (if applicable)
- Duration in seconds
- Transcript (if available)
- Summary

All calls are visible in the Voice Agent dashboard at `/app/voice`.

## Outbound Call Policy

Outbound calls to leads require explicit approval in the approval queue. The agent prepares a call brief and creates an `ApprovalRequest` of type `BOOK_CALL`. No call is made until the operator approves.

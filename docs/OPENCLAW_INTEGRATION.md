# OpenClaw Integration

GrowthAgent OS supports OpenClaw as an optional LLM-powered agent engine.

## What is OpenClaw?

OpenClaw is an agent orchestration gateway that routes tasks to LLM backends (OpenAI, Anthropic, etc.) via a standardised API. When configured, GrowthAgent OS sends lead research and scoring tasks to the gateway instead of using the local deterministic engine.

## Configuration

Set in Settings → Agent → OpenClaw Integration:

| Field | Description |
|-------|-------------|
| Gateway URL | The URL of your OpenClaw instance |
| Agent ID | The pre-configured agent in OpenClaw |
| Workspace ID | Your OpenClaw workspace |
| Channel | Routing channel (default: `default`) |
| API Key | Bearer token for authentication |

Or via environment variables:

```env
AGENT_PROVIDER=openclaw
OPENCLAW_DEFAULT_GATEWAY_URL=https://your-gateway.openclaw.ai
OPENCLAW_DEFAULT_API_KEY=your_token_here
```

## Fallback Behaviour

If OpenClaw is unreachable or credentials are invalid:

- All agent tasks fall back to the local deterministic engine
- An error is logged but no customer-facing error is shown
- Lead scoring continues uninterrupted

## Testing the Connection

Use the **Test Connection** button in Settings → Agent. A successful response returns:

```json
{ "status": "connected", "message": "Gateway reachable" }
```

## Per-Company Override

Each company can have its own OpenClaw gateway URL, agent ID, and API key. These are stored encrypted in the `Company` model and take precedence over environment defaults.

## Security

- API keys are stored server-side only
- Keys are never returned in API responses (masked in UI)
- Each request uses the company's specific key, not a shared key

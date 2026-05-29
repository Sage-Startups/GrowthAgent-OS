import type { AgentProvider } from "./types"
import { LocalAgentProvider } from "./local-provider"
import { OpenClawProvider } from "./openclaw-provider"

type CompanyAgentCfg = {
  openclawEnabled?: boolean | null
  openclawGatewayUrl?: string | null
  openclawApiKey?: string | null
  openclawAgentId?: string | null
  openclawWorkspaceId?: string | null
  openclawChannel?: string | null
}

export function getAgentProvider(companyCfg?: CompanyAgentCfg | null): AgentProvider {
  const globalMode = process.env.AGENT_PROVIDER ?? "local"
  const companyOverride = companyCfg?.openclawEnabled === true && !!companyCfg?.openclawGatewayUrl

  if (globalMode === "openclaw" || companyOverride) {
    const url = companyCfg?.openclawGatewayUrl ?? process.env.OPENCLAW_DEFAULT_GATEWAY_URL
    const key = companyCfg?.openclawApiKey ?? process.env.OPENCLAW_DEFAULT_API_KEY ?? ""
    if (url) {
      return new OpenClawProvider({ gatewayUrl: url, apiKey: key, agentId: companyCfg?.openclawAgentId ?? undefined, workspaceId: companyCfg?.openclawWorkspaceId ?? undefined, channel: companyCfg?.openclawChannel ?? undefined })
    }
  }
  return new LocalAgentProvider()
}

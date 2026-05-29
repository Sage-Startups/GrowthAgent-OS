export type AgentTaskType =
  | "QUALIFY_LEAD"
  | "GENERATE_REPLY"
  | "CREATE_FOLLOW_UP"
  | "PREPARE_SALES_CALL"
  | "GENERATE_WEEKLY_REPORT"
  | "COMPETITOR_MONITORING"
  | "PROPOSAL_PREP"
  | "CLIENT_ONBOARDING"

export type AgentTaskInput = {
  companyId: string
  userId?: string
  leadId?: string
  taskType: AgentTaskType
  instructions?: string
  context: Record<string, unknown>
}

export type RecommendedAction = {
  label: string
  actionType: string
  requiresApproval: boolean
  payload: Record<string, unknown>
}

export type AgentTaskOutput = {
  success: boolean
  summary: string
  structuredData?: Record<string, unknown>
  draftText?: string
  recommendedActions?: RecommendedAction[]
  raw?: unknown
}

export interface AgentProvider {
  runTask(input: AgentTaskInput): Promise<AgentTaskOutput>
  sendChatMessage(input: {
    companyId: string
    userId: string
    message: string
    context: Record<string, unknown>
  }): Promise<AgentTaskOutput>
}

type ReplyStyle = "professional" | "friendly" | "direct" | "premium-consultative"

type ReplyInput = {
  companyName: string
  mainOffer?: string | null
  toneOfVoice?: string | null
  leadName: string
  leadCompany?: string | null
  leadMessage?: string | null
  scoreBand: string
  recommendedAction?: string | null
  painPoints?: string | null
}

export function generateReply(input: ReplyInput, style?: ReplyStyle): string {
  const resolvedStyle = style ?? toneToStyle(input.toneOfVoice)
  const firstName = input.leadName.split(" ")[0]
  const offer = input.mainOffer ?? "our services"
  const leadCo = input.leadCompany ? ` at ${input.leadCompany}` : ""

  switch (resolvedStyle) {
    case "professional":
      return `Hi ${firstName},

Thank you for your enquiry about ${offer}.

I have reviewed the details you shared${leadCo} and would welcome the opportunity to discuss how ${input.companyName} can help.

${input.scoreBand === "HOT" || input.scoreBand === "WARM"
  ? `Based on what you have described, I believe we have a strong solution for your requirements. I would like to schedule a brief call to understand your situation in more detail.

Would you be available for a 20-minute conversation this week?`
  : `To ensure we can provide the most relevant information, could you share a little more about your goals and timeline?`}

Kind regards,
[Your name]
${input.companyName}`

    case "friendly":
      return `Hey ${firstName}! 👋

Thanks so much for reaching out — really glad you did!

${input.leadCompany ? `I had a quick look at ${input.leadCompany} and ` : ""}I think there is a great chance we can help. ${offer} is exactly what we specialise in.

${input.scoreBand === "HOT" || input.scoreBand === "WARM"
  ? `I would love to jump on a quick 20-minute call and show you what this could look like for you. When works best?`
  : `Can you tell me a bit more about what you are trying to achieve? That way I can give you the most useful advice.`}

Speak soon,
[Your name] 😊
${input.companyName}`

    case "direct":
      return `Hi ${firstName},

Got your message. Here is where we stand:

${input.scoreBand === "HOT" || input.scoreBand === "WARM"
  ? `✓ We can help with what you need
✓ Timeline looks workable
✓ Next step: 20-min call

Book a slot: [link] or reply to this email.`
  : `We specialise in ${offer}. To give you a straight answer on whether we are the right fit, I need two things from you:

1. What is your budget range?
2. What is your timeline?

Reply here or book 20 mins: [link]`}

— [Your name]
${input.companyName}`

    case "premium-consultative":
      return `Dear ${firstName},

Thank you for considering ${input.companyName}.

I have reviewed your enquiry${leadCo ? ` from ${input.leadCompany}` : ""} carefully. ${offer} is one of our core specialisms, and from what you have shared, I can already see several areas where our approach would add meaningful value.

${input.scoreBand === "HOT" || input.scoreBand === "WARM"
  ? `Before I recommend a specific approach, I would value 20 minutes of your time to understand the full context — the goals, constraints, and what success looks like for you. This allows me to prepare a genuinely relevant proposal rather than a generic one.

Would you be open to a brief strategy call this week?`
  : `To give you a considered response rather than a generic one, I would appreciate a little more context. Could you outline your primary objective and approximate timeline?`}

With best regards,
[Your name]
${input.companyName}`
  }
}

function toneToStyle(tone: string | null | undefined): ReplyStyle {
  const t = (tone ?? "").toLowerCase()
  if (t.includes("friendly") || t.includes("warm") || t.includes("conversational")) return "friendly"
  if (t.includes("direct") || t.includes("concise")) return "direct"
  if (t.includes("premium") || t.includes("consultative") || t.includes("expert")) return "premium-consultative"
  return "professional"
}

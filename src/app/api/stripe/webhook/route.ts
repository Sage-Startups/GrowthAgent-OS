import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/db"
import { resetMonthlyCredits, applyPlanLimits } from "@/lib/usage-service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
})

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("Stripe webhook signature verification failed:", msg)
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const stripeCustomerId = invoice.customer as string | null
        if (!stripeCustomerId) break

        const company = await prisma.company.findUnique({ where: { stripeCustomerId } })
        if (!company) break

        // Reset monthly credits
        await resetMonthlyCredits(company.id)

        // Apply plan limits from subscription
        const subscriptionId = invoice.subscription as string | null
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const planName = subscription.metadata?.planName ?? company.stripePlanName ?? "starter"
          await applyPlanLimits(company.id, planName)
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const stripeCustomerId = subscription.customer as string | null
        if (!stripeCustomerId) break

        const company = await prisma.company.findUnique({ where: { stripeCustomerId } })
        if (!company) break

        const planName = subscription.metadata?.planName ?? subscription.items.data[0]?.price?.nickname ?? "starter"

        await prisma.company.update({
          where: { id: company.id },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePlanName: planName,
            stripePlanStatus: subscription.status,
          },
        })

        await applyPlanLimits(company.id, planName)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const stripeCustomerId = subscription.customer as string | null
        if (!stripeCustomerId) break

        const company = await prisma.company.findUnique({ where: { stripeCustomerId } })
        if (!company) break

        await prisma.company.update({
          where: { id: company.id },
          data: { stripePlanStatus: "canceled" },
        })
        break
      }
    }

    // Record webhook event
    await prisma.webhookEvent.create({
      data: {
        source: "stripe",
        eventType: event.type,
        payload: event as unknown as import("@prisma/client").Prisma.InputJsonValue,
        processed: true,
        processedAt: new Date(),
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error(`Error processing Stripe webhook ${event.type}:`, msg)

    await prisma.webhookEvent.create({
      data: {
        source: "stripe",
        eventType: event.type,
        payload: event as unknown as import("@prisma/client").Prisma.InputJsonValue,
        processed: false,
        error: msg,
      },
    })

    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

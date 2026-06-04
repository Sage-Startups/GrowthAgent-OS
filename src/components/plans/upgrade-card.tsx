import Link from "next/link"
import { Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type PlanTier = "Starter" | "Pipeline" | "Growth OS"

interface UpgradeCardProps {
  feature: string
  description: string
  requiredPlan: PlanTier
  currentPlan?: PlanTier
}

const planColors: Record<PlanTier, string> = {
  "Starter": "text-slate-400 border-slate-700",
  "Pipeline": "text-violet-400 border-violet-500/30 bg-violet-500/5",
  "Growth OS": "text-amber-400 border-amber-500/30 bg-amber-500/5",
}

export function UpgradeCard({ feature, description, requiredPlan }: UpgradeCardProps) {
  return (
    <Card className="border-slate-800 border-dashed">
      <CardContent className="py-12 text-center">
        <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-5 w-5 text-slate-500" />
        </div>
        <h3 className="text-base font-semibold mb-1">{feature}</h3>
        <p className="text-sm text-slate-400 mb-4 max-w-xs mx-auto">{description}</p>
        <Badge variant="outline" className={`text-xs mb-4 ${planColors[requiredPlan]}`}>
          Requires {requiredPlan} plan
        </Badge>
        <div className="mt-2">
          <Button variant="gradient" size="sm" asChild>
            <Link href="/app/settings?tab=billing">Upgrade Plan</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

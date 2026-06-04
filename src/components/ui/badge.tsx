import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/20 text-primary hover:bg-primary/30",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive/20 text-destructive hover:bg-destructive/30",
        outline: "text-foreground border-slate-700",
        success: "border-transparent bg-emerald-500/20 text-emerald-400",
        warning: "border-transparent bg-yellow-500/20 text-yellow-400",
        hot: "border-red-500/30 bg-red-500/20 text-red-400",
        warm: "border-orange-500/30 bg-orange-500/20 text-orange-400",
        cold: "border-blue-500/30 bg-blue-500/20 text-blue-400",
        bad_fit: "border-slate-500/30 bg-slate-500/20 text-slate-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpSchema, type SignUpInput } from "@/lib/validations"
import { Bot } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpInput) => {
    setError(null)
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) {
      setError(result.error ?? "Something went wrong")
      return
    }
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    router.push("/app/onboarding")
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 mx-auto mb-4">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-slate-400 mt-1">Start your GrowthAgent OS journey</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Alex Johnson" {...register("name")} />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Min. 8 characters" {...register("password")} />
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>
        <Button type="submit" variant="gradient" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
          Sign in
        </Link>
      </p>
      <p className="text-center text-xs text-slate-500 mt-4">
        By creating an account you agree to our terms of service.
      </p>
    </div>
  )
}

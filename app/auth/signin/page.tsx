"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { createDemoUser } from "./actions"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setDemoLoading(true)
    setError("")

    try {
      // First try to sign in with existing demo user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: "demo@taskvault.com",
        password: "demo123456",
      })

      if (signInError) {
        // If demo user doesn't exist, try to create it
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Creating demo user... Please wait.")

          const result = await createDemoUser()

          if (result.success) {
            // Try signing in again after creating the user
            const { error: retrySignInError } = await supabase.auth.signInWithPassword({
              email: "demo@taskvault.com",
              password: "demo123456",
            })

            if (retrySignInError) {
              setError("Demo user created but sign-in failed. Please try the demo button again in a moment.")
            } else {
              router.push("/dashboard")
            }
          } else {
            setError(result.error || "Failed to create demo user. Please sign up for a regular account.")
          }
        } else {
          setError(signInError.message)
        }
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="glass-effect border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400">Sign in to access your TaskVault</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white focus:border-purple-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading || demoLoading} className="w-full btn-primary">
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">Or</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading || demoLoading}
                className="w-full btn-secondary"
              >
                {demoLoading ? "Setting up demo..." : "Try Demo Account"}
              </Button>

              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded p-2">{error}</div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-800 rounded-lg">
              <p className="text-xs text-purple-300">
                <strong>Demo Account:</strong> The demo will automatically create a test user with sample tasks to
                explore TaskVault's features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSignUp, useClerk } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { client } = useClerk()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Submitting the signup form
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)
    setError(null)

    const fullName = form.name
    const email = form.email
    const password = form.password
    const confirmPassword = form.confirmPassword

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    const [firstName, ...rest] = fullName.trim().split(" ")
    const lastName = rest.join(" ")

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      })

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setPendingVerification(true)
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // Verification of the code received by email
  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)
    setError(null)

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: form.code })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        await client?.reload()
        window.location.href = "/"
      } else {
        setError("Invalid code, please try again.")
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-[#15803d]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#15803d]">Create Account</CardTitle>
          <CardDescription className="text-[#15803d]/70">
            {pendingVerification ? "Enter the code sent to your email" : "Sign up to get started"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!pendingVerification ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#15803d] font-medium">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="border-[#15803d]/30 focus:border-[#15803d] focus:ring-[#15803d]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#15803d] font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="border-[#15803d]/30 focus:border-[#15803d] focus:ring-[#15803d]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#15803d] font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="border-[#15803d]/30 focus:border-[#15803d] focus:ring-[#15803d]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#15803d] font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="border-[#15803d]/30 focus:border-[#15803d] focus:ring-[#15803d]/20"
                  required
                />
              </div>

              {/* Smart CAPTCHA visible */}
              <div id="clerk-captcha"></div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#15803d] hover:bg-[#15803d]/90 text-white"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-[#15803d] font-medium">Verification Code</Label>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Enter the code"
                  className="border-[#15803d]/30 focus:border-[#15803d] focus:ring-[#15803d]/20 text-center"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#15803d] hover:bg-[#15803d]/90 text-white"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          )}

          {!pendingVerification && (
            <div className="text-center">
              <p className="text-sm text-[#15803d]/70">
                Already have an account?{" "}
                <Link href="/login" className="text-[#15803d] hover:text-[#15803d]/80 font-medium underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

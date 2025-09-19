import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-[#15803d]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#15803d]">Welcome Back</CardTitle>
          <CardDescription className="text-[#15803d]/70">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#15803d] font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border-[#15803d]/30 focus:border-[#15803d] focus:ring-[#15803d]/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#15803d] font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="border-[#15803d]/30 focus:border-[#15803d] focus:ring-[#15803d]/20"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#15803d] hover:bg-[#15803d]/90 text-white">
              Sign In
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-[#15803d]/70">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#15803d] hover:text-[#15803d]/80 font-medium underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

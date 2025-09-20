"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function LoginPage() {
    const { isSignedIn } = useUser();
    const router = useRouter();
    const [showUI, setShowUI] = useState(false);
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      } else {
        console.log(result);
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-[#15803d]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#15803d]">Welcome Back</CardTitle>
          <CardDescription className="text-[#15803d]/70">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#15803d] font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#15803d]/30 focus:border-[#15803d] focus:ring-[#15803d]/20"
                required
              />
            </div>
             {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#15803d] hover:bg-[#15803d]/90 text-white"
            >
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

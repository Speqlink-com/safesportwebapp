"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import type { SignInFormData } from "../types";

export function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement sign-in logic
    console.log("Sign in with:", formData);

    // Redirect to OTP verification
    router.push("/account/verify-otp");
  };

  const handleOAuthSignIn = (provider: "google" | "facebook") => {
    // TODO: Implement OAuth sign-in
    console.log(`Sign in with ${provider}`);

    // Redirect to OTP verification
    router.push("/account/verify-otp");
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
        <p className="text-muted-foreground">
          <b>Smarter sports. Safer athletes.</b> <br />
          Sign in to manage your athletes, monitor risk, and keep your team
          ready.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="* * * * * * *"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            minLength={8}
          />
        </div>

        <div className="flex justify-end">
          <Link
            href="/account/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full h-12 text-base">
          Sign in
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-base"
          onClick={() => handleOAuthSignIn("google")}
        >
          <FcGoogle className="size-5" />
          Sign in with Google
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t you have an account?{" "}
        <Link href="/account/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

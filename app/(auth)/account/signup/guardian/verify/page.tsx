"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeftIcon } from "lucide-react"

export default function GuardianVerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const relationship = searchParams.get("relationship") || ""
  const athleteId = searchParams.get("athleteId") || ""
  const email = searchParams.get("email") || ""
  const password = searchParams.get("password") || ""
  
  const [otp, setOtp] = useState(["", "", "", ""])
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => {
    if (!firstName || !lastName || !relationship || !athleteId || !email || !password) {
      router.push("/account/signup/guardian/name")
    }
  }, [firstName, lastName, relationship, athleteId, email, password, router])

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 4)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, idx) => {
      if (idx < 4) newOtp[idx] = char
    })
    setOtp(newOtp)
    
    const lastIndex = Math.min(pastedData.length, 3)
    inputRefs[lastIndex].current?.focus()
  }

  const handleVerify = () => {
    const otpCode = otp.join("")
    console.log("Verify OTP:", otpCode)
    
    router.push(`/account/signup/guardian/review?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&relationship=${encodeURIComponent(relationship)}&athleteId=${encodeURIComponent(athleteId)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
  }

  const handleResend = () => {
    console.log("Resend OTP to:", email)
    setOtp(["", "", "", ""])
    inputRefs[0].current?.focus()
  }

  const handleBack = () => {
    router.push(`/account/signup/guardian/account?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&relationship=${encodeURIComponent(relationship)}&athleteId=${encodeURIComponent(athleteId)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
  }

  const isComplete = otp.every((digit) => digit !== "")

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Back Button */}
      <div>
        <Button 
          onClick={handleBack}
          variant="ghost"
          size="sm"
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Back
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step 5 of 6</span>
          <span>83%</span>
        </div>
        <Progress value={83} />
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground">
            We've sent a 4-digit code to <strong>{email}</strong>
          </p>
        </div>

        <div className="flex gap-3 justify-center py-4">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-14 h-14 text-center text-2xl font-semibold"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleVerify}
            disabled={!isComplete}
            size="lg"
          >
            Verify Email
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            className="text-sm text-primary hover:underline"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    </div>
  )
}

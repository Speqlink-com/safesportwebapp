"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react"
import { mockAthletes } from "@/features/safesport/data/mock-data"

export default function GuardianReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const relationship = searchParams.get("relationship") || ""
  const athleteId = searchParams.get("athleteId") || ""
  const email = searchParams.get("email") || ""
  const password = searchParams.get("password") || ""

  const athlete = mockAthletes.find(a => a.id === athleteId)
  
  const relationshipLabels: Record<string, string> = {
    parent: "Parent",
    legal_guardian: "Legal Guardian",
    other: "Other"
  }

  useEffect(() => {
    if (!firstName || !lastName || !relationship || !athleteId || !email || !password) {
      router.push("/account/signup/guardian/name")
    }
  }, [firstName, lastName, relationship, athleteId, email, password, router])

  const handleSubmit = () => {
    console.log("Creating guardian account:", {
      firstName,
      lastName,
      relationship,
      athleteId,
      email,
      password: "[REDACTED]"
    })

    router.push("/safesport/guardian")
  }

  const handleBack = () => {
    router.push(`/account/signup/guardian/verify?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&relationship=${encodeURIComponent(relationship)}&athleteId=${encodeURIComponent(athleteId)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
  }

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
          <span>Step 6 of 6</span>
          <span>100%</span>
        </div>
        <Progress value={100} />
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Review your information</h1>
          <p className="text-muted-foreground">Make sure everything looks correct</p>
        </div>

        <Card className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{firstName} {lastName}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Relationship</p>
            <p className="font-medium">{relationshipLabels[relationship]}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Athlete</p>
            <p className="font-medium">{athlete?.firstName} {athlete?.lastName}</p>
            <p className="text-sm text-muted-foreground">{athlete?.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{email}</p>
          </div>
        </Card>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            size="lg"
          >
            Create Account
            <CheckCircleIcon className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

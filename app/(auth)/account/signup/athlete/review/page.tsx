"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react"
import { mockOrganizations } from "@/features/safesport/data/mock-data"

export default function AthleteReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const dob = searchParams.get("dob") || ""
  const orgId = searchParams.get("orgId") || ""
  const orgName = searchParams.get("orgName") || ""
  const email = searchParams.get("email") || ""
  const password = searchParams.get("password") || ""

  const organization = mockOrganizations.find(o => o.id === orgId)

  useEffect(() => {
    if (!firstName || !lastName || !dob || !orgId || !email || !password) {
      router.push("/account/signup/athlete/name")
    }
  }, [firstName, lastName, dob, orgId, email, password, router])

  const handleSubmit = () => {
    // Generate SafeSport ID (in real app, would be done by backend)
    const safeSportId = `ATH-${Math.floor(Math.random() * 90000) + 10000}`
    
    // TODO: Call API to create account
    console.log("Creating athlete account:", {
      safeSportId,
      firstName,
      lastName,
      dateOfBirth: dob,
      organizationId: orgId,
      email,
      password: "[REDACTED]"
    })

    // Redirect to athlete dashboard
    router.push("/safesport/athlete")
  }

  const handleBack = () => {
    router.push(`/account/signup/athlete/verify?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&dob=${encodeURIComponent(dob)}&orgId=${encodeURIComponent(orgId)}&orgName=${encodeURIComponent(orgName)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Back Button - Top Left of Form */}
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
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="font-medium">{new Date(dob).toLocaleDateString("en-US", { 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Institution</p>
            <p className="font-medium">{organization?.name}</p>
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

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import { mockOrganizations } from "@/features/safesport/data/mock-data";

export default function AthleteTeamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const dob = searchParams.get("dob") || "";

  const [search, setSearch] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState(
    searchParams.get("orgId") || "",
  );

  useEffect(() => {
    if (!firstName || !lastName || !dob) {
      router.push("/account/signup/athlete/name");
    }
  }, [firstName, lastName, dob, router]);

  // Filter institutions (exclude medical)
  const allInstitutions = mockOrganizations.filter((o) => o.type !== "medical");

  const filteredInstitutions = allInstitutions
    .filter(
      (org) =>
        search === "" || org.name.toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 2); // Show only 2 institutions at a time

  const canProceed = selectedOrgId.length > 0;

  const handleNext = () => {
    if (canProceed) {
      const selectedOrg = mockOrganizations.find((o) => o.id === selectedOrgId);
      router.push(
        `/account/signup/athlete/account?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&dob=${encodeURIComponent(dob)}&orgId=${encodeURIComponent(selectedOrgId)}&orgName=${encodeURIComponent(selectedOrg?.name || "")}`,
      );
    }
  };

  const handleBack = () => {
    router.push(
      `/account/signup/athlete/dob?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&dob=${encodeURIComponent(dob)}`,
    );
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Back Button - Top Left of Form */}
      <div>
        <Button onClick={handleBack} variant="ghost" size="sm">
          <ArrowLeftIcon className="mr-2 size-4" />
          Back
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step 3 of 6</span>
          <span>50%</span>
        </div>
        <Progress value={50} />
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Which institution are you part of?
          </h1>
          <p className="text-muted-foreground">
            Search to see more institutions
          </p>
        </div>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by institution name..."
          autoFocus
        />

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredInstitutions.map((org) => (
            <Card
              key={org.id}
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                selectedOrgId === org.id ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setSelectedOrgId(org.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {org.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{org.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {org.type}
                  </p>
                </div>
                {selectedOrgId === org.id && (
                  <CheckCircleIcon className="size-5 text-primary" />
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={handleNext} disabled={!canProceed} size="lg">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

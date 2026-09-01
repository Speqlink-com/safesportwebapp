"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  AlertCircle,
  Calendar,
  Search,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  mockRehabilitationPlans,
  mockReassessments,
  mockProgressReviews,
  mockNeedsAttentionItems,
} from "@/features/safesport/data/mock-rehabilitation";
import Link from "next/link";

export default function RehabilitationPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate stats
  const activeRehab = mockRehabilitationPlans.filter(p => 
    ["active", "on_track", "needs_attention", "review_due"].includes(p.status)
  ).length;

  const needsAttention = mockNeedsAttentionItems.length;
  const progressReviews = mockProgressReviews.filter(r => r.status === "pending").length;
  const reassessmentsDue = mockReassessments.filter(r => r.status === "scheduled").length;
  const overdue = mockReassessments.filter(r => r.status === "overdue").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Rehabilitation</h1>
          <p className="text-sm text-muted-foreground">
            Track active recovery, progress reviews and reassessments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search athletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_track">On Track</SelectItem>
              <SelectItem value="needs_attention">Needs Attention</SelectItem>
              <SelectItem value="review_due">Review Due</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Plan
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="space-y-6">
          {/* Stats Strip */}
          <div className="grid grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Rehab</p>
                <p className="text-3xl font-bold text-blue-600">{activeRehab}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Needs Attention</p>
                <p className="text-3xl font-bold text-orange-600">{needsAttention}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Progress Reviews</p>
                <p className="text-3xl font-bold text-purple-600">{progressReviews}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Reassessments Due</p>
                <p className="text-3xl font-bold text-yellow-600">{reassessmentsDue}</p>
              </div>
            </Card>
            <Card className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{overdue}</p>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-6 pt-6">
                <TabsList className="h-auto bg-transparent border-0 p-0">
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#72E34D] rounded-none px-4 pb-3"
                  >
                    Active Rehab
                    <Badge variant="secondary" className="ml-2">{activeRehab}</Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="plans"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#72E34D] rounded-none px-4 pb-3"
                  >
                    Rehab Plans
                    <Badge variant="secondary" className="ml-2">{mockRehabilitationPlans.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#72E34D] rounded-none px-4 pb-3"
                  >
                    Progress Reviews
                    <Badge variant="secondary" className="ml-2">{progressReviews}</Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="reassessments"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[#72E34D] rounded-none px-4 pb-3"
                  >
                    Reassessments
                    <Badge variant="secondary" className="ml-2">{reassessmentsDue}</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Contents */}
              <TabsContent value="active" className="m-0 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Active Rehabilitation</h3>
                  {/* Active rehab content will go here */}
                  <p className="text-sm text-muted-foreground">Active rehabilitation cases...</p>
                </div>
              </TabsContent>

              <TabsContent value="plans" className="m-0 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Rehabilitation Plans</h3>
                  <p className="text-sm text-muted-foreground">All rehabilitation plans...</p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="m-0 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Progress Reviews</h3>
                  <p className="text-sm text-muted-foreground">Pending progress reviews...</p>
                </div>
              </TabsContent>

              <TabsContent value="reassessments" className="m-0 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Reassessments</h3>
                  <p className="text-sm text-muted-foreground">Scheduled reassessments...</p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

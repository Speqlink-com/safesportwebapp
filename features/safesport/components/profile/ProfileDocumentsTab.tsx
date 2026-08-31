"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  AwardIcon,
} from "lucide-react"
import type { Athlete } from "@/features/safesport/types"

interface ProfileDocumentsTabProps {
  athlete: Athlete
}

type Document = {
  id: string
  name: string
  type: "certificate" | "report" | "consent" | "other"
  date: string
  format: "PDF" | "DOC" | "JPG"
}

export function ProfileDocumentsTab({ athlete }: ProfileDocumentsTabProps) {
  // Build document list from athlete data
  const documents: Document[] = []

  // Add PPE certificates
  athlete.ppeAssessments.forEach((ppe) => {
    if (ppe.certificate) {
      documents.push({
        id: `cert-${ppe.id}`,
        name: "Eligibility Certificate",
        type: "certificate",
        date: ppe.assessmentDate,
        format: "PDF",
      })
    }
  })

  // Add screening reports
  athlete.screenings.forEach((screening) => {
    if (screening.status === "reviewed") {
      documents.push({
        id: `screen-${screening.id}`,
        name: `Movement Screening - ${screening.drill.replace(/_/g, " ")}`,
        type: "report",
        date: screening.createdAt,
        format: "PDF",
      })
    }
  })

  // Sort by date descending
  documents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getDocumentIcon = (type: Document["type"]) => {
    switch (type) {
      case "certificate":
        return <AwardIcon className="size-5 text-primary" />
      case "report":
        return <FileTextIcon className="size-5 text-muted-foreground" />
      default:
        return <FileTextIcon className="size-5 text-muted-foreground" />
    }
  }

  const getDocumentTypeLabel = (type: Document["type"]) => {
    switch (type) {
      case "certificate":
        return "Certificate"
      case "report":
        return "Report"
      case "consent":
        return "Consent"
      default:
        return "Document"
    }
  }

  return (
    <div className="space-y-6">
      {/* Documents Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Certificates</p>
          <p className="text-2xl font-semibold">
            {documents.filter(d => d.type === "certificate").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Reports</p>
          <p className="text-2xl font-semibold">
            {documents.filter(d => d.type === "report").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total documents</p>
          <p className="text-2xl font-semibold">{documents.length}</p>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">My documents</h3>
            <p className="text-sm text-muted-foreground">Your SafeSport certificates and reports</p>
          </div>
          <Separator className="mb-4" />

          {documents.length > 0 ? (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getDocumentIcon(doc.type)}
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getDocumentTypeLabel(doc.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(doc.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs font-mono">
                          {doc.format}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <EyeIcon className="size-4" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <DownloadIcon className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <FileTextIcon className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No documents available yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your SafeSport documents will appear here as you complete assessments
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Document Categories */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <AwardIcon className="size-8 text-primary shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium mb-1">Certificates</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Official eligibility and clearance certificates
              </p>
              <p className="text-sm font-semibold">
                {documents.filter(d => d.type === "certificate").length} available
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <FileTextIcon className="size-8 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium mb-1">Reports</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Movement screenings and assessment reports
              </p>
              <p className="text-sm font-semibold">
                {documents.filter(d => d.type === "report").length} available
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Document Permissions Notice */}
      <Card className="p-4 bg-muted/50 border-muted">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Only documents you are permitted to access are shown here. Some clinical records and clinician-only notes are managed separately by your clinical team and are not included in this library.
        </p>
      </Card>
    </div>
  )
}

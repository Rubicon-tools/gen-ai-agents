"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Download, FileText, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Report {
  filename: string
  date: string
  size: string
}

export function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch existing reports
  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports")
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const generateReport = async () => {
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Report Generated",
          description: `Successfully generated ${data.filename}`,
        })
        // Refresh the reports list
        await fetchReports()
      } else {
        throw new Error("Failed to generate report")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = (filename: string) => {
    const link = document.createElement("a")
    link.href = `/api/reports/${filename}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Generate Report Button */}
      <Button onClick={generateReport} disabled={isGenerating} className="w-full" size="lg">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Report...
            </motion.div>
          ) : (
            <motion.div
              key="generate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Previous Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading reports...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No reports generated yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report, index) => (
                  <motion.tr
                    key={report.filename}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <TableCell className="font-medium">{report.filename}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{report.size}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReport(report.filename)}
                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const reportsDir = path.join(process.cwd(), "reports")

    let files: string[]
    try {
      files = await readdir(reportsDir)
    } catch (error) {
      // Reports directory doesn't exist
      return NextResponse.json({ reports: [] })
    }

    // Filter for PDF files and get their stats
    const pdfFiles = files.filter((file) => file.endsWith(".pdf"))

    const reports = await Promise.all(
      pdfFiles.map(async (filename) => {
        const filePath = path.join(reportsDir, filename)
        const stats = await stat(filePath)

        return {
          filename,
          date: stats.mtime.toLocaleDateString(),
          size: `${Math.round(stats.size / 1024)} KB`,
        }
      }),
    )

    // Sort by date (newest first)
    reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("[v0] Failed to list reports:", error)
    return NextResponse.json({ error: "Failed to list reports" }, { status: 500 })
  }
}

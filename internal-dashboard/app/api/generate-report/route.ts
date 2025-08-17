import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { readdir } from "fs/promises"
import path from "path"

const execAsync = promisify(exec)

export async function POST() {
  try {
    // Get list of files before generation
    const reportsDir = path.join(process.cwd(), "reports")
    let filesBefore: string[] = []

    try {
      filesBefore = await readdir(reportsDir)
    } catch (error) {
      // Reports directory doesn't exist yet, that's okay
      filesBefore = []
    }

    // Run the docker script
    console.log("[v0] Starting report generation...")
    const { stdout, stderr } = await execAsync("bash docker.sh generate", {
      cwd: process.cwd(),
      timeout: 300000, // 5 minute timeout
    })

    console.log("[v0] Docker script output:", stdout)
    if (stderr) {
      console.log("[v0] Docker script stderr:", stderr)
    }

    // Check for new files
    let filesAfter: string[] = []
    try {
      filesAfter = await readdir(reportsDir)
    } catch (error) {
      console.error("[v0] Failed to read reports directory after generation:", error)
      return NextResponse.json(
        { error: "Report generation completed but failed to access reports directory" },
        { status: 500 },
      )
    }

    // Find the new file
    const newFiles = filesAfter.filter((file) => !filesBefore.includes(file) && file.endsWith(".pdf"))

    if (newFiles.length === 0) {
      return NextResponse.json(
        { error: "Report generation completed but no new PDF file was created" },
        { status: 500 },
      )
    }

    const newFilename = newFiles[0] // Take the first new PDF file
    console.log("[v0] New report generated:", newFilename)

    return NextResponse.json({
      success: true,
      filename: newFilename,
      message: "Report generated successfully",
    })
  } catch (error) {
    console.error("[v0] Report generation failed:", error)
    return NextResponse.json(
      { error: "Failed to generate report", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

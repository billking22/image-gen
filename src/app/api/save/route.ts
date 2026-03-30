import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { image, filename } = await req.json();
    
    // Extract base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Define output directory
    const outputDir = path.join(process.cwd(), "outputs");
    
    // Ensure directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Write file
    const filePath = path.join(outputDir, filename);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, path: filePath });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ success: false, error: "Failed to save image" }, { status: 500 });
  }
}

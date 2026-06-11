import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    const { email, source } = await req.json();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const logLine = `${new Date().toISOString()}\t${email}\t${source || "sample-gate"}\n`;
    const logPath = path.join(process.cwd(), "private", "sample-emails.log");
    try {
      fs.appendFileSync(logPath, logLine);
    } catch (e) {
      console.error("sample log write failed:", e.message);
    }

    const pdfPath = path.join(process.cwd(), "private", "sample-brief.pdf");
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { error: "Sample temporarily unavailable. Email hello@scoutfile.ai." },
        { status: 500 }
      );
    }

    const file = fs.readFileSync(pdfPath);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="ScoutFile-Sample-Brief.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("sample error:", err.message);
    return NextResponse.json(
      { error: "Could not send the sample. Try again." },
      { status: 500 }
    );
  }
}

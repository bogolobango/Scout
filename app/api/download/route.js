import Stripe from "stripe";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { site } from "../../../config/site";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session." }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed for this session." },
        { status: 403 }
      );
    }

    const filePath = path.join(process.cwd(), "private", site.fileName);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Package not found on server. Contact support." },
        { status: 500 }
      );
    }

    const file = fs.readFileSync(filePath);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${site.fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("download error:", err.message);
    return NextResponse.json(
      { error: "Could not verify purchase." },
      { status: 500 }
    );
  }
}

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  if (!clientPromise) {
    return NextResponse.json(
      {
        ok: false,
        message: "MONGODB_URI is not set. Add it to .env.local and restart dev server.",
      },
      { status: 500 }
    );
  }

  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });

    return NextResponse.json({ ok: true, message: "MongoDB connected" });
  } catch {
    return NextResponse.json(
      { ok: false, message: "MongoDB connection failed" },
      { status: 500 }
    );
  }
}

import { Webhook } from "svix";
import  { connectDB } from "@/db/connectDB";
import { User } from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
if (!CLERK_WEBHOOK_SECRET) {
  throw new Error("Missing CLERK_WEBHOOK_SECRET in environment variables.");
}

interface ClerkWebhookEvent {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Verify Clerk Webhook Signature
    const payload = await req.text(); // ✅ Fix: Read body as text
    const headers = req.headers;

    const svixHeaders = {
      "svix-id": headers.get("svix-id") ?? "",
      "svix-timestamp": headers.get("svix-timestamp") ?? "",
      "svix-signature": headers.get("svix-signature") ?? "",
    };

    const wh = new Webhook(CLERK_WEBHOOK_SECRET || "");
    const event = wh.verify(payload, svixHeaders) as ClerkWebhookEvent;

    console.log("Clerk Webhook Event:", event);

    const { id, email_addresses, first_name, last_name } = event.data;

    if (event.type === "user.created") {
      await User.create({
        clerkId: id,
        email: email_addresses[0]?.email_address ?? "",
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      });
    } else if (event.type === "user.updated") {
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses[0]?.email_address ?? "",
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        }
      );
    } else if (event.type === "user.deleted") {
      await User.findOneAndDelete({ clerkId: id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }
}

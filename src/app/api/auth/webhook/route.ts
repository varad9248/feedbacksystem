import type { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";
import connectDB from "@/db/connectDB";
import { User } from "@/models/User.model";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!CLERK_WEBHOOK_SECRET) {
  throw new Error("Missing CLERK_WEBHOOK_SECRET in environment variables.");
}

// Define the expected Clerk webhook event structure
interface ClerkWebhookEvent {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    // Verify Clerk Webhook Signature
    const headers = req.headers;
    const payload = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const svixHeaders: Record<string, string> = {
      "svix-id": headers["svix-id"] as string,
      "svix-timestamp": headers["svix-timestamp"] as string,
      "svix-signature": headers["svix-signature"] as string,
    };

    const wh = new Webhook(CLERK_WEBHOOK_SECRET || '');
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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return res.status(400).json({ error: "Webhook verification failed" });
  }
}

export const config = {
  api: {
    bodyParser: true, // Ensure body is parsed properly
  },
};

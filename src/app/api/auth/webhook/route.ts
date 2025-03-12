import connectDB from "@/db/connectDB";
import { User } from "@/models/User.model";
import { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB(); 

  // Verify Clerk Webhook Signature
  const headers = req.headers;
  const payload = JSON.stringify(req.body);
  const svixHeaders = {
    "svix-id": headers["svix-id"],
    "svix-timestamp": headers["svix-timestamp"],
    "svix-signature": headers["svix-signature"]
  };

  try {
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    const event = wh.verify(payload, svixHeaders as any) as any;

    console.log("Clerk Webhook Event:", event);

    const { id, email_addresses, first_name, last_name } = event.data;

    if (event.type === "user.created") {
      // Create new user in MongoDB
      await User.create({
        clerkId: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
      });
    } else if (event.type === "user.updated") {
      // Update existing user
      await User.findOneAndUpdate(
        { clerkId: id },
        { email: email_addresses[0].email_address, name: `${first_name} ${last_name}` }
      );
    } else if (event.type === "user.deleted") {
      // Delete user from MongoDB
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
    bodyParser: true,
  },
};

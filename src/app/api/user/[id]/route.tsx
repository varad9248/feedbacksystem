import connectDB from "@/db/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@/models/User.model";

// Schema for user ID validation
const paramsSchema = z.object({
  id: z.string().length(24, { message: "Invalid user ID format" }),
});

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();

    const { params } = context;

    // Validate user ID
    const validation = paramsSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format().id?._errors[0] || "Invalid user ID" },
        { status: 400 }
      );
    }

    // Find user by ID and exclude password
    const user = await User.findById(params.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

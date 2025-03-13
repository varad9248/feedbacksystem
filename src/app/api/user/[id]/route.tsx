import { connectDB } from "@/db/connectDB";
import { User } from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for user ID validation
const paramsSchema = z.object({
  id: z.string().length(24, { message: "Invalid user ID format" }),
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    await connectDB();

    // Validate user ID
    const validation = paramsSchema.safeParse({ id });
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format().id?._errors[0] || "Invalid user ID" },
        { status: 400 }
      );
    }

    // Find user by ID and exclude password
    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

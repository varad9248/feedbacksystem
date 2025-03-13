import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import  {connectDB } from "@/db/connectDB";
import { Feedback } from "@/models/Feedback.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { userId } = getAuth(req);
    
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const feedbacks = await Feedback.find({ user: userId }).populate("formId", "title").sort({ createdAt: -1 });

    return NextResponse.json(feedbacks, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

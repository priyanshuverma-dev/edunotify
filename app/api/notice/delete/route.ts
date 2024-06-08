import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    const { schoolId, noticeId } = await request.json();

    if (!schoolId || !noticeId) {
      return NextResponse.json(
        { message: "School ID and Notice ID are required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const school = await db.school.findUnique({
      where: {
        id: schoolId,
      },
    });

    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    await db.notice.delete({
      where: {
        id: noticeId,
        schoolId: schoolId,
      },
    });

    return NextResponse.json({ message: "Notice deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

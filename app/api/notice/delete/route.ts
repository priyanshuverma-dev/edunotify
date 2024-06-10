import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    const { schoolId, noticeId } = await request.json();

    // Check if all required fields are provided
    if (!schoolId || !noticeId) {
      return NextResponse.json(
        { message: "School ID and Notice ID are required" },
        { status: 400 }
      );
    }

    // Check if the user is authenticated
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if the school exists
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

    // Check if the user has permission to delete notice
    // Check if the user has permission to create notice
    const check = await permit.check({ key: userId }, "delete", {
      type: "notice",
      tenant: school.id,
    });

    if (!check) {
      return NextResponse.json(
        { message: "You don't have permission to delete notice" },
        { status: 403 }
      );
    }

    // Delete the notice
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

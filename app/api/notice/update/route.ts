import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, content, schoolId, noticeId } = await req.json();

    // Check if all required fields are provided
    if (!title || !content || !noticeId || !schoolId) {
      return NextResponse.json(
        { message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Check if the user is authenticated
    const { userId } = auth();

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
        { message: "School doesn't exists" },
        { status: 400 }
      );
    }

    // Check if notice exists
    const notice = await db.notice.findUnique({
      where: {
        id: noticeId,
        schoolId,
      },
    });

    if (!notice) {
      return NextResponse.json(
        { message: "Notice doesn't exists" },
        { status: 400 }
      );
    }

    // Check if the user has permission to update notice
    const check = await permit.check({ key: userId }, "update", {
      type: "notice",
      tenant: school.id,
    });

    if (!check) {
      return NextResponse.json(
        { message: "You don't have permission to create notice" },
        { status: 403 }
      );
    }

    // Update the notice
    await db.notice.update({
      where: {
        id: noticeId,
        schoolId,
      },
      data: {
        content,
        title,
      },
    });

    return NextResponse.json({
      message: "Notice Updated, Changes will reflect soon",
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

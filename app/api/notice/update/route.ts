import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, content, schoolId, noticeId } = await req.json();

    if (!title || !content || !noticeId || !schoolId) {
      return NextResponse.json(
        { message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Create school
    const { userId } = auth();

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
        { message: "School doesn't exists" },
        { status: 400 }
      );
    }

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

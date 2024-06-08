import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, content, schoolId } = await req.json();

    if (!title || !content || !schoolId) {
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
        { message: "Can't find school" },
        { status: 400 }
      );
    }

    const check = await permit.check(
      {
        key: userId,
      },
      "create",
      {
        type: "notice",
        tenant: school.id,
      }
    );

    if (!check) {
      return NextResponse.json(
        { message: "You don't have permission to create notice" },
        { status: 403 }
      );
    }

    const notice = await db.notice.create({
      data: {
        title,
        content,
        schoolId,
      },
    });

    return NextResponse.json({ message: "Notice created" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, content, schoolId } = await req.json();

    // Check if all required fields are provided
    if (!title || !content || !schoolId) {
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
        { message: "Can't find school" },
        { status: 400 }
      );
    }

    // Check if the user has permission to create notice
    const check = await permit.check({ key: userId }, "create", {
      type: "notice",
      tenant: school.id,
    });

    if (!check) {
      return NextResponse.json(
        { message: "You don't have permission to create notice" },
        { status: 403 }
      );
    }

    // Create the notice
    await db.notice.create({
      data: {
        title,
        content,
        schoolId,
      },
    });

    return NextResponse.json({ message: "Notice created" });
  } catch (error: any) {
    // Handle error
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

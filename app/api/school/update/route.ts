import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, description, phone, email, schoolId } = await req.json();

    if (!name || !phone || !email) {
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

    await db.school.update({
      where: {
        id: schoolId,
      },
      data: {
        name,
        description,
        phone,
        email,
        userId,
      },
    });

    return NextResponse.json({
      message: "School Updated, Changes will reflect soon",
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

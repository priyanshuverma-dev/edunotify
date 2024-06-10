import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, description, phone, email, schoolId } = await req.json();

    // Check if all required fields are provided
    if (!name || !phone || !email) {
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

    // Check if the user has permission to update school
    const check = await permit.check({ key: userId }, "update", {
      type: "school",
      tenant: schoolId,
    });

    if (!check) {
      return NextResponse.json(
        { message: "You don't have permission to update school" },
        { status: 403 }
      );
    }

    // Update the school
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

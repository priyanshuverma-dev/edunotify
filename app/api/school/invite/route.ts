import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, schoolId } = await req.json();

    if (!email) {
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

    const schoolExist = await db.school.findUnique({
      where: {
        id: schoolId,
      },
    });

    if (!schoolExist) {
      return NextResponse.json(
        { message: "School does't exists" },
        { status: 400 }
      );
    }

    const syncedUsers = await permit.api.listUsers();
    const userExists = syncedUsers.find((user) => user.email === email);

    if (!userExists) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }

    if (schoolExist.teachers.includes(email)) {
      return NextResponse.json(
        { message: "User is already a teacher" },
        { status: 400 }
      );
    }

    if (userExists.key === schoolExist.userId) {
      return NextResponse.json(
        { message: "You can't add principal" },
        { status: 400 }
      );
    }

    const school = await db.school.update({
      where: {
        userId,
      },
      data: {
        teachers: {
          push: email,
        },
      },
    });

    await permit.api.assignRole({
      role: "teacher",
      user: userExists.key,
      tenant: school.id,
    });

    return NextResponse.json({ message: `${email} added in school` });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

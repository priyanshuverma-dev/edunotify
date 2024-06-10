import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, schoolId } = await req.json();

    // Check if all required fields are provided
    if (!schoolId || !email) {
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

    // List all users from permit API
    const syncedUsers = await permit.api.listUsers();
    const userExists = syncedUsers.find((user) => user.email === email);

    // Check if user exists
    if (!userExists) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }

    // Check if user is already a teacher
    if (schoolExist.teachers.includes(email)) {
      return NextResponse.json(
        { message: "User is already a teacher" },
        { status: 400 }
      );
    }

    // Check if user is already a principal
    if (userExists.key === schoolExist.userId) {
      return NextResponse.json(
        { message: "You can't add principal" },
        { status: 400 }
      );
    }

    // Check if the user has permission to add teacher
    const check = await permit.check({ key: userId }, "update", {
      type: "school",
      tenant: schoolId,
    });

    if (!check) {
      return NextResponse.json(
        { message: "You don't have permission to add teacher" },
        { status: 403 }
      );
    }

    // Add teacher to school
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

    // Assign the user as the teacher of the school
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

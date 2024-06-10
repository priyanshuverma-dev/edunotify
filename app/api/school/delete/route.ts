import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    const { schoolId } = await request.json();

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const school = await db.school.findUnique({
      where: {
        id: schoolId,
        userId,
      },
    });

    // Check if school exists
    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    // Check if the user has permission to delete school
    const check = await permit.check({ key: userId }, "delete", {
      type: "school",
      tenant: school.id,
    });

    if (!check) {
      return NextResponse.json(
        { message: "You don't have permission to delete school" },
        { status: 403 }
      );
    }

    // Delete the school
    await db.school.delete({
      where: {
        id: schoolId,
      },
    });

    // Unassign the user from the tenant
    await permit.api.unassignRole({
      role: "principal",
      user: userId,
      tenant: schoolId,
    });

    // Delete the tenant
    await permit.api.deleteTenant(schoolId);

    return NextResponse.json({ message: "School deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

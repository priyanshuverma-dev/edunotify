import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    const { schoolId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const school = await db.school.findUnique({
      where: {
        id: schoolId,
        userId,
      },
    });

    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    await db.school.delete({
      where: {
        id: schoolId,
      },
    });
    await permit.api.deleteTenant(schoolId);

    return NextResponse.json({ message: "School deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

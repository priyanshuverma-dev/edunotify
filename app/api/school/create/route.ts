import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, description, phone, email } = await req.json();

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

    const userWithSchool = await db.school.findUnique({
      where: {
        userId,
      },
    });

    if (userWithSchool) {
      return NextResponse.json(
        { message: "You already have a school" },
        { status: 400 }
      );
    }

    const school = await db.school.create({
      data: {
        name,
        description,
        phone,
        email,
        userId,
      },
    });

    const tenant = await permit.api.createTenant({
      key: school.id,
      name: school.name,
    });

    await permit.api.assignRole({
      role: "principal",
      user: userId,
      tenant: tenant.id,
    });

    return NextResponse.json({ message: "School created" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

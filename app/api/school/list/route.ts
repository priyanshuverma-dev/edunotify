import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") ?? "";

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get schools with the query
    const schoolsWithoutMine = await db.school.findMany({
      where: {
        userId: {
          not: userId,
        },
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    // Get my school
    const mySchool = await db.school.findUnique({
      where: {
        userId,
      },
    });

    // Combine my school and schools without mine making sure my school is first
    const schools = mySchool
      ? [mySchool, ...schoolsWithoutMine]
      : [...schoolsWithoutMine];

    return NextResponse.json(schools);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

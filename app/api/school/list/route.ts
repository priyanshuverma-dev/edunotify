import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") ?? "";

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    const mySchool = await db.school.findUnique({
      where: {
        userId,
      },
    });

    const schools = mySchool
      ? [mySchool, ...schoolsWithoutMine]
      : [...schoolsWithoutMine];

    return NextResponse.json(schools);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

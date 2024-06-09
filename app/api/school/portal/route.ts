import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const schoolId = searchParams.get("id");
    if (!schoolId) throw new Error("School ID is required");

    const { userId } = auth();

    if (!userId) throw new Error("User not found");

    const school = await db.school.findUnique({
      where: {
        id: schoolId,
      },
      include: {
        notices: true,
      },
    });

    if (!school) throw new Error("School not found");

    const userRoles = await permit.api.getAssignedRoles(userId);

    const roles = userRoles.map((role) => {
      return {
        role: role.role,
        tenant: role.tenant,
      };
    });
    const isStudent = roles.includes({
      role: "student",
      tenant: "default",
    });
    const tenant = isStudent ? "default" : schoolId;

    console.log("{ROLES}", roles);

    const currentRole = roles.find((role) => role.tenant === tenant);

    const permissions = await permit.getUserPermissions(
      userId,
      [tenant],
      ["school", "notice"]
    );

    return NextResponse.json({
      school,
      permissions:
        (permissions[`__tenant:${school!.id}`]
          ? permissions[`__tenant:${school!.id}`]
          : permissions[`__tenant:default`]
        )?.permissions ?? [],
      currentRole: currentRole?.role ?? "viewer",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

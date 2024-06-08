import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Dict } from "permitio/build/main/utils/dict";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { resourcesAndActions } = await req.json();
    const searchParams = req.nextUrl.searchParams;
    // const tenant = searchParams.get("tenant") ?? "";

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "No userId provided." },
        { status: 400 }
      );
    }

    const checkPermissions = async (resourceAndAction: Dict) => {
      const { resource, action, userAttributes, resourceAttributes } =
        resourceAndAction;

      const allowed = permit.check(
        {
          key: userId,
          attributes: userAttributes,
        },
        action,
        {
          type: resource,
          attributes: resourceAttributes,
          tenant: userAttributes.tenant,
        }
      );

      return allowed;
    };

    const permittedList = await Promise.all(
      resourcesAndActions.map(checkPermissions)
    );

    return NextResponse.json({ permittedList });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

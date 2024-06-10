import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Dict } from "permitio/build/main/utils/dict";

export const dynamic = "force-dynamic"; // force dynamic for next js no caching

export async function POST(req: NextRequest) {
  try {
    const { resourcesAndActions } = await req.json();

    const { userId } = auth();

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "No userId provided." },
        { status: 400 }
      );
    }

    // Check all resources and actions for permission
    // offical permitio docs: https://docs.permit.io/integrations/feature-flagging/casl
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

    // Make list of all permissions
    const permittedList = await Promise.all(
      resourcesAndActions.map(checkPermissions)
    );

    return NextResponse.json({ permittedList });
  } catch (error) {
    // Handle error
    console.error(error);
    return NextResponse.json(
      { error: `Internal Server Error ${error}` },
      { status: 500 }
    );
  }
}

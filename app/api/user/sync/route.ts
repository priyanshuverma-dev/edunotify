import { Webhook } from "svix";
import { headers } from "next/headers";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import permit from "@/lib/permit";
import db from "@/lib/db";

/**
 * This route is used to sync data between Clerk and the Permit API.
 * @see https://clerk.com/docs/integrations/webhooks/sync-data
 * @see https://docs.permit.io/sdk/nodejs/quickstart-nodejs
 */

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = evt.data;

  const eventType = evt.type;

  // Handle user created event
  if (eventType === "user.created") {
    // Create a new user in the permit API
    await permit.api.createUser({
      key: id!,
      email: (evt.data as UserJSON).email_addresses[0].email_address,
    });

    // Assign the role of student to the user initially
    await permit.api.assignRole({
      role: "student",
      user: id!,
      tenant: "default",
    });
  }

  // Handle user deleted event
  if (eventType === "user.deleted") {
    // Find the school associated with the user
    const schoolWithUser = await db.school.findUnique({
      where: {
        userId: id!,
      },
    });

    if (schoolWithUser) {
      // Delete the school associated with the user and tenant from the permit API
      await db.school.delete({
        where: {
          userId: id!,
        },
      });
      await permit.api.deleteTenant(schoolWithUser.id);
    }

    // Delete the user from the permit API
    await permit.api.deleteUser(id!);
  }

  return new Response("", { status: 200 });
}

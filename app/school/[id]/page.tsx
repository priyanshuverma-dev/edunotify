import db from "@/lib/db";
import React from "react";
import ObjectID from "bson-objectid";
import { Separator } from "@/components/ui/separator";
import ActionButtons from "@/components/school/action-buttons";
import { currentUser } from "@clerk/nextjs/server";
import moment from "moment";
import permit from "@/lib/permit";
import NoticeActionButtons from "@/components/notice-action-buttons";
export const revalidate = 3600;

export default async function Page({ params }: { params: { id: string } }) {
  if (!ObjectID.isValid(params.id)) {
    return <div>Invalid ID</div>;
  }

  const user = await currentUser();

  const school = await db.school.findUnique({
    where: {
      id: params.id,
    },
    include: {
      notices: true,
    },
  });

  if (!user) {
    return <div>Not authorized</div>;
  }

  if (!school) {
    return <div>School not found</div>;
  }

  const userRoles = await permit.api.getAssignedRoles(user.id);
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
  const tenant = isStudent ? "default" : school.id;

  console.log("{ROLES}", roles);

  const permissions = await permit.getUserPermissions(
    user!.id,
    [tenant],
    ["school", "notice"]
  );

  return (
    <div>
      <div>
        <h1 className="text-3xl p-2 font-bold">{school.name}</h1>
        <p className="pt-2 px-2">{school.description}</p>

        <p className="pb-2 px-2">
          Contact: <span className="text-green-600">{school.phone}</span>,{" "}
          <span className="text-green-600">{school.email}</span>
        </p>
      </div>
      <ActionButtons
        school={school}
        permissions={
          (permissions[`__tenant:${school.id}`]
            ? permissions[`__tenant:${school.id}`]
            : permissions[`__tenant:default`]
          )?.permissions ?? []
        }
      />

      <div>
        <h2 className="text-2xl p-2 font-bold">Notes</h2>
        <Separator />
        <ul>
          {school.notices.length === 0 && (
            <li className="text-center p-2">No notes found</li>
          )}
          {school.notices.map((note) => (
            <li key={note.id} className="shadow m-1 p-2 rounded-lg">
              <h3 className="text-xl p-2 font-bold">{note.title}</h3>
              <p className="p-2">{note.content}</p>
              <p className="p-2 text-sm text-green-600">
                Created at {moment(note.createdAt).fromNow()}
              </p>
              <NoticeActionButtons
                schoolId={school.id}
                notice={note}
                permissions={
                  (permissions[`__tenant:${school.id}`]
                    ? permissions[`__tenant:${school.id}`]
                    : permissions[`__tenant:default`]
                  )?.permissions ?? []
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

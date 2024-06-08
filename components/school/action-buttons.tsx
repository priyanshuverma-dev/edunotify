"use client";

import { School } from "@prisma/client";
import { Button } from "../ui/button";
import { updateSchoolModalState } from "@/states/update-school-modal";
import { inviteTeachersModalState } from "@/states/invite-teachers-modal";
import { Trash } from "lucide-react";
import { createNoticeModalState } from "@/states/create-notice-modal";
import { deleteModalState } from "@/states/delete-modal";
import toast from "react-hot-toast";
import React from "react";
import { useRouter } from "next/navigation";

export default function ActionButtons({
  school,
  permissions,
}: {
  school: School;
  permissions: string[];
}) {
  const updateSchoolModal = updateSchoolModalState();
  const createNoticeModal = createNoticeModalState();
  const InviteTeachersModal = inviteTeachersModalState();
  const deleteModal = deleteModalState();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const canDelete = permissions.includes("school:delete");
  const canUpdate = permissions.includes("school:update");

  async function deleteSchool() {
    try {
      setLoading(true);
      const res = await fetch("/api/school/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolId: school.id,
        }),
      });

      const data = await res.json();
      if (res.status != 200) throw new Error(data.message);

      toast.success(data.message);

      deleteModal.onClose();
      router.push("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {canDelete && (
        <Button
          disabled={loading}
          onClick={() => deleteModal.onOpen(deleteSchool)}
          variant={"destructive"}
          size={"icon"}
          className="m-2"
        >
          <Trash size={18} />
        </Button>
      )}
      {canUpdate && (
        <>
          <Button
            disabled={loading}
            onClick={() => updateSchoolModal.onOpen()}
            variant={"secondary"}
            className="m-2"
          >
            Edit School
          </Button>
          <Button
            disabled={loading}
            onClick={() => InviteTeachersModal.onOpen(school.teachers)}
            variant={"secondary"}
            className="m-2"
          >
            Invite Teachers
          </Button>
          <Button
            disabled={loading}
            onClick={() => createNoticeModal.onOpen()}
            variant={"outline"}
            className="m-2"
          >
            Add Note
          </Button>
        </>
      )}
    </div>
  );
}

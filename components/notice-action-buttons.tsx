"use client";

import { Notice, School } from "@prisma/client";
import { updateSchoolModalState } from "@/states/update-school-modal";
import { inviteTeachersModalState } from "@/states/invite-teachers-modal";
import { Edit, Trash } from "lucide-react";
import { createNoticeModalState } from "@/states/create-notice-modal";
import { deleteModalState } from "@/states/delete-modal";
import toast from "react-hot-toast";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { updateNoticeModalState } from "@/states/update-notice-modal";

export default function NoticeActionButtons({
  schoolId,
  notice,
  permissions,
}: {
  schoolId: string;
  notice: Notice;
  permissions: string[];
}) {
  const updateNoticeModal = updateNoticeModalState();
  const deleteModal = deleteModalState();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const canDelete = permissions.includes("notice:delete");
  const canUpdate = permissions.includes("notice:update");

  async function deleteNotice() {
    try {
      setLoading(true);
      const res = await fetch("/api/notice/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolId: schoolId,
          noticeId: notice.id,
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
          onClick={() => deleteModal.onOpen(deleteNotice)}
          variant={"ghost"}
          size={"icon"}
        >
          <Trash size={18} className="text-destructive" />
        </Button>
      )}
      {canUpdate && (
        <>
          <Button
            disabled={loading}
            onClick={() => updateNoticeModal.onOpen(notice)}
            variant={"ghost"}
          >
            <Edit size={18} />
          </Button>
        </>
      )}
    </div>
  );
}

"use client";

import CreateNoticeModal from "@/components/modals/create-notice-modal";
import ConfirmationModal from "@/components/modals/delete-modal";
import InviteTeachersModal from "@/components/modals/invite-teachers-modal";
import RegisterSchoolModal from "@/components/modals/register-school-modal";
import UpdateNoticeModal from "@/components/modals/update-notice-modal";
import UpdateSchoolModal from "@/components/modals/update-school-modal";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <RegisterSchoolModal />
      <UpdateSchoolModal />
      <InviteTeachersModal />
      <CreateNoticeModal />
      <UpdateNoticeModal />
      <ConfirmationModal />
      <Toaster />
    </>
  );
}

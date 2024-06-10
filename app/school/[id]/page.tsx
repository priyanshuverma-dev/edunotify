"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import ActionButtons from "@/components/school/action-buttons";
import moment from "moment";
import NoticeActionButtons from "@/components/notice-action-buttons";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useSchoolPortal from "@/hooks/use-school-portal";

export default function Page({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSchoolPortal({
    schoolId: params.id,
  });

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">Loading...</div>
    );
  }
  if (error) {
    return <div>Error loading school</div>;
  }

  const school = data?.school;
  const permissions = data?.permissions;
  const currentRole = data?.currentRole;

  return (
    <div>
      <Link
        href={"/"}
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "w-full"
        )}
      >
        Back
      </Link>
      {
        <p className="p-2">
          Your Current Role:{" "}
          <span className="text-green-600">{currentRole}</span>
        </p>
      }
      <div>
        <h1 className="text-3xl p-2 font-bold">{school?.name}</h1>
        <p className="pt-2 px-2">{school?.description}</p>

        <p className="pb-2 px-2">
          Contact: <span className="text-green-600">{school?.phone}</span>,{" "}
          <span className="text-green-600">{school?.email}</span>
        </p>
      </div>
      <ActionButtons school={school!} permissions={permissions ?? []} />

      <div>
        <h2 className="text-2xl p-2 font-bold">Notes</h2>
        <Separator />
        <ul>
          {school?.notices.length === 0 && (
            <li className="text-center p-2">No notes found</li>
          )}
          {school?.notices.map((note) => (
            <li key={note.id} className="shadow m-1 p-2 rounded-lg">
              <h3 className="text-xl p-2 font-bold">{note.title}</h3>
              <p className="p-2">{note.content}</p>
              <p className="p-2 text-sm text-green-600">
                Created at {moment(note.createdAt).fromNow()}
              </p>
              <NoticeActionButtons
                schoolId={school!.id}
                notice={note}
                permissions={permissions ?? []}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

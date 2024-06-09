"use client";
import React from "react";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import useSchools from "@/hooks/use-schools";

export default function SchoolList() {
  const searchParams = useSearchParams();
  const q = searchParams.get("search") || "";
  const { user } = useUser();

  const { data, error, isLoading } = useSchools({ query: q });
  // return the error message if there is an error
  if (isLoading) {
    return Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="border-2 p-2 rounded-lg shadow mt-5 mx-5 w-full">
        <div className="flex flex-row py-2 w-full h-full">
          <Skeleton className="h-6 w-[415px] max-[440px]:w-[90vw]" />
        </div>
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-12 w-[380px] max-[440px]:w-[80vw]" />
          <Separator />
          <Skeleton className="h-6 w-[340px] max-[440px]:w-[60vw]" />
        </div>
      </div>
    ));
  }

  if (error) {
    return (
      <details className="text-destructive leading-8">
        <summary>Error loading schools 😢</summary>
        {error.message}
      </details>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <h1 className="text-2xl p-2 font-bold">Registered Schools</h1>

      {data?.length == 0 ? (
        <div className="border-2 p-2 rounded-lg shadow m-5 w-full">
          <p className="text-center">No schools found</p>
        </div>
      ) : (
        data?.map((school, idx) => {
          const ownSchool = user?.id == school.userId;
          console.log("ownSchool", ownSchool, user?.id, school.userId);

          return (
            <>
              <div
                key={idx}
                className="border-2 p-2 rounded-lg shadow mt-5 mx-5 w-full"
              >
                <Link href={`/school/${school.id}`} key={school.id}>
                  <div className="flex flex-row py-2 w-full h-full">
                    <p className="pr-1 underline">
                      {school.name}
                      {"  "}
                      {ownSchool ? "(own)" : ""}
                    </p>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span>{school.description}</span>
                    <Separator />
                    <span>School Email: {school.email}</span>
                  </div>
                </Link>
              </div>
              {ownSchool && <Separator className="mt-2" />}
            </>
          );
        })
      )}
      <span className="py-1">End of list. </span>
    </div>
  );
}

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { Check } from "lucide-react";
import MaxWidthWrapper from "./max-width-wrapper";

export default function SignedOutView() {
  return (
    <div className="bg-slate-50 grainy-light">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10  sm:pb-32 lg:gap-x-0 xl:gap-x-8  lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center flex flex-col items-center">
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl ">
                Get Updated with your School.{" "}
                <span className="bg-green-600 px-2 text-white">EduNotify</span>{" "}
                Online Notice Board.
              </h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                EduNotify is a platform that allows you to stay updated with
                your school's{" "}
                <span className="font-semibold">
                  activities, events, and announcements.{" "}
                </span>
                Get started by signing in as a student or a teacher. Stay
                informed, stay updated.
              </p>

              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Realtime updates
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Managed by your school
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-green-600" />
                    Easy to use
                  </li>
                </div>
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 text-center">
                Get started with EduNotify
              </h2>
              <div className="flex flex-col items-center justify-between space-y-2">
                <Button variant={"outline"} className="w-full">
                  <SignInButton mode="modal">
                    <p>Continue as Student or Teacher</p>
                  </SignInButton>
                </Button>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}

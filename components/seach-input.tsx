"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { registerSchoolModalState } from "@/states/register-school-modal";

export default function SearchInput() {
  const q = useSearchParams().get("search");
  const [query, setquery] = useState(q || "");
  const registerSchoolModal = registerSchoolModalState();

  return (
    <>
      <form className="flex flow-row p-5 w-full justify-center items-center space-x-1">
        <div className="relative flex">
          <Input
            placeholder="Search"
            name="search"
            type="text"
            value={query}
            className="w-[300px] max-[440px]:w-[70vw]"
            onChange={(e) => setquery(e.target.value)}
          />
          {q && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-2"
              onClick={() => (window.location.href = "/")}
            >
              <X />
            </button>
          )}
        </div>
        <Button type="submit" variant={"outline"}>
          Search
        </Button>
      </form>
      <div className="flex w-full justify-center items-center">
        <Button
          variant={"secondary"}
          className="w-[385px] max-[440px]:w-[90vw]"
          onClick={() => registerSchoolModal.onOpen()}
        >
          Register a school
        </Button>
      </div>
    </>
  );
}

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="flex flex-row justify-between items-center p-5 shadow">
      <Link href="/">
        <h1 className="tracking-tight text-balance font-bold !leading-tight text-2xl">
          Edu<span className="text-green-600">Notify</span>
        </h1>
      </Link>
      <UserButton />
    </nav>
  );
}

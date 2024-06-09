"use server";

import db from "@/lib/db";
import permit from "@/lib/permit";
import { auth } from "@clerk/nextjs/server";

export const schoolWithPermissions = async ({
  schoolId,
}: {
  schoolId: string;
}) => {
  try {
    return {};
  } catch (error) {
    console.error(error);
    return {
      error,
    };
  }
};

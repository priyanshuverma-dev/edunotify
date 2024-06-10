"use client";

/**
 * REACT QUERY FOR SCHOOL PORTAL
 * @see /api/school/portal
 */

import { Notice, SchoolStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const useSchoolPortal = ({ schoolId }: { schoolId: string }) => {
  const { data, error, isLoading, status, refetch } = useQuery({
    queryKey: ["school_portal", schoolId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/school/portal?id=${schoolId}`);
        const body = await response.json(); // Parse the response body

        if (response.status == 200) {
          return body as {
            school: SchoolWithNotices;
            permissions: string[];
            currentRole: string;
          };
        } else {
          throw new Error(body.message);
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  });

  return {
    data,
    error,
    isLoading,
    status,
    refetch,
  };
};

export default useSchoolPortal;

type SchoolWithNotices = {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  status: SchoolStatus;
  teachers: string[];
  userId: string;
  notices: Notice[];
};

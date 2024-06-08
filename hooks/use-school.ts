"use client";

import { School } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const useSchool = ({ schoolId }: { schoolId: string }) => {
  const { data, error, isLoading, status, refetch } = useQuery({
    queryKey: ["school", schoolId],
    enabled: !!schoolId,
    queryFn: async () => {
      try {
        const response = await fetch(`/api/school/get/${schoolId}`);
        const body = await response.json(); // Parse the response body

        if (response.status == 200) {
          return body as School;
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

export default useSchool;

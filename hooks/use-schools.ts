"use client";

/**
 * REACT QUERY FOR SCHOOLS
 * @see /api/school/list
 */

import { School } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const useSchools = ({ query }: { query: string }) => {
  const { data, error, isLoading, status, refetch } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/school/list?query=${query}`);
        const body = await response.json(); // Parse the response body

        if (response.status == 200) {
          return body as School[];
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

export default useSchools;

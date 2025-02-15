import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./axiosSecure";

const useAllTeacher = (params = "") => {
  const {
    data: teachers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["teacher", params],
    queryFn: async () => {
      const res = await axiosSecure.get(`/get/teacher?status=${params}`);
      return res?.data?.data || [];
    },
  });

  return { teachers, isLoading, refetch };
};

export default useAllTeacher;

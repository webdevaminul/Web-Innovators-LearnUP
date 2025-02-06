import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./axiosSecure";

const useAllCourse = ({ status } = { status: undefined }) => {
  const {
    data: courses = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["courses", status],
    queryFn: async () => {
      const res = await axiosSecure.get("/all/courses", {
        params: { status },
      });
      const data = res?.data?.data;
      return data || [];
    },
  });

  return { courses, isLoading, refetch };
};

export default useAllCourse;

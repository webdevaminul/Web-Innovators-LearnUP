import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./axiosSecure";

const useEnrolledCourse = () => {
  const {
    data: enrolledCourses = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["enrolledCourse"],
    queryFn: async () => {
      const res = await axiosSecure.get("/enrolled/courses");
      return res?.data?.result;
    },
  });

  return { enrolledCourses, isLoading, refetch };
};

export default useEnrolledCourse;

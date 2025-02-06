import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./axiosSecure";

const useAllUser = () => {
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/get/user`);
        return res?.data.data || [];
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
  });

  return { users, isLoading, refetch };
};

export default useAllUser;

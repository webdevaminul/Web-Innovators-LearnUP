import { useQuery } from "@tanstack/react-query";
import axiosSecure from "./axiosSecure";

const useBlogPost = () => {
  const {
    data: blogs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["blog"],
    queryFn: async () => {
      const res = await axiosSecure.get("/blog/allBlogPosts");
      return res?.data.data;
    },
  });

  return { blogs, isLoading, refetch };
};

export default useBlogPost;

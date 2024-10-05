import { useState, useEffect } from "react";
import useApiFetch from "./useApiFetch";

const useInfiniteScroll = (
  initialParams,
  fetchOnMount = true,
  apiFetchOptions = {}
) => {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { fetchData, isLoading, error } = useApiFetch(apiFetchOptions);

  const fetchMoreData = async () => {
    if (isLoading || !hasMore) return;

    try {
      const newData = await fetchData();
      setData((prevData) => [...prevData, ...newData]);
      setHasMore(newData.length > 0);
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchMoreData();
    }
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    fetchMoreData();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMore]);

  return { isLoading, data, error };
};

export default useInfiniteScroll;

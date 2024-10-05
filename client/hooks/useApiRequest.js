'use client'

import { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { loadingState } from "@/data/store";

const useApiRequest = () => {
  const setLoadingState = useSetRecoilState(loadingState);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const sendRequest = async (url, options = {}) => {
    const { method, body, headers, params } = options;

    setLoadingState(true);
    return axios({
      method,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${url}`,
      data: body,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      params: params,
      withCredentials: true,
    })
      .then((response) => {
        setData(response.data);
        setLoadingState(false);
        return response;
      })
      .catch((error) => {
        setError(
          error.response ? error.response.data.error : "Something went wrong!"
        );
        setLoadingState(false);
        throw error;
      });
  };

  return { data, error, sendRequest };
};

export default useApiRequest;

import { useCallback, useEffect, useState } from "react";

// Helper function to handle the sending of http requests
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();

  // If the response is not ok (i.e., To handle 400ish or 500ish status code)
  if (!response.ok) {
    throw new Error(resData.message || "Something went wrong, failed to send request.");
  }

  return resData;
}

// Custom hook to send http request and manage the response data,
// isLoading and error states
export default function useHttp(url, config, initialValue) {
  const [data, setData] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Function to clear the data
  function clearData() {
    setData(initialValue);
  }

  // Function to send http request and get the response data
  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true);
      try {
        const resData = await sendHttpRequest(url, { ...config, body: data });
        setData(resData);
      } catch (error) {
        setError(error.message || "Something went wrong!");
      }
      setIsLoading(false);
    },
    [url, config]
  );

  // Call the sendRequest method only if it is a GET request
  useEffect(() => {
    if (!config || !config.method || config.method === "GET") {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData,
  };
}

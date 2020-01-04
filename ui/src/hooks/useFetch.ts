import { useState, useEffect } from 'react';

export const useFetch = (url: string) => {
  const [data, setData] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect((): any => {
    let abortController = new AbortController(); // to clean up after component unmounts
    // loading set to true for spinner to show up
    setLoading(true);
    // make the api call
    fetch(url, {
      method: 'GET',
      signal: abortController.signal,
      credentials: 'include'
    })
      .then(response => response.json())
      // where the magic happens
      .then(data => {
        setData(data);
        setLoading(false);
      })
      // where the sadness hits the roof
      .catch(error => console.error('err', error));

    return () => {
      abortController.abort();
    };
  }, [url]); // dependency array to call the lifecycle event once again if the url changes.

  // return these bad boys to the RFC.
  return [data, loading];
};

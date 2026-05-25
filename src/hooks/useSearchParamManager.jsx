import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';

export function useSearchParamManager() {
  let [searchParams, setSearchParams] = useSearchParams();
  const updateQueue = useRef([]); // Queue for holding update requests
  const isProcessing = useRef(false); // Track if an update is being processed

  // Function to process the queue
  const processQueue = useCallback(() => {
    if (isProcessing.current || updateQueue.current.length === 0) {
      return;
    }


    isProcessing.current = true;

    const nextUpdate = updateQueue.current.shift();

    setSearchParams((prevSearchParams) => {
      const updatedParams = new URLSearchParams(prevSearchParams);
      // Apply all new params from the queued update
      for (const [key, value] of Object.entries(nextUpdate)) {
        //update the above logic to handle deleting params
        if (value === null) {
          updatedParams.delete(key);
        } else {
          updatedParams.set(key, value);
        }
      }

      return updatedParams;
    });

    // Allow the next update to be processed after the current one is complete
    isProcessing.current = false;

    // Check for any remaining updates in the queue
    if (updateQueue.current.length > 0) {
      processQueue(); // Process the next update in the queue
    }
  }, [setSearchParams]);

  // Function to enqueue an update request
  const queueSetSearchParams = useCallback((newParams) => {
    updateQueue.current.push(newParams);
    processQueue();
  }, [processQueue]);

  return { searchParams, queueSetSearchParams };
}

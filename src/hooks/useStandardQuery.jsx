import { useQuery } from "@tanstack/react-query";
// import { useGetToken } from "./useGetToken";
import { useEffect } from "react";

export const useStandardQuery = ({
  queryKey,
  queryFn,
  queryConfig,
  enabled = true,
  //Default to 5 mins
  staleTime = 300000,
  excludeToken = false,
}) => {
  
  // const { token } = useGetToken();

  const enabledModified = enabled == true; // &&  !!token;

  const { isPending, isError, data, error, status, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => await queryFn({ ...queryConfig, }), //token: excludeToken ? null : token }),
    enabled: enabledModified,
    staleTime: staleTime,});

  return { isPending, isError, data, error, status, refetch };
};

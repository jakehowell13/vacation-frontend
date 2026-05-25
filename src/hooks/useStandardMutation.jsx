import { useMutation } from "@tanstack/react-query";
// import { useGetToken } from "./useGetToken";

export const useStandardMutation = ({functionToCall, config}) => {
  //const { ensureToken } = useGetToken();

  const { isPending, isError, data, error, status, mutateAsync } = useMutation({
    mutationFn: async () => await functionToCall({ ...config }), //, token: currentToken }),
  });

  return { isPending, isError, data, error, status, mutateAsync };
};
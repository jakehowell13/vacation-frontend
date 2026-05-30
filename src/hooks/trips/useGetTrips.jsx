import { getTrips } from "@/services/trip-service";
import { useStandardQuery } from "../useStandardQuery";
import { useUser } from "@/providers/UserProvider";

export const useGetTrips = (user = null) => {

    const { isPending, isError, data, error, status, refetch } = useStandardQuery({
        queryKey: [`trips`, user],
        queryConfig: { 
            params: null,
            user: user
        },
        queryFn: getTrips,
        enabled: true
    });

    return { isPending, isError, data, error, status, refetch };
}
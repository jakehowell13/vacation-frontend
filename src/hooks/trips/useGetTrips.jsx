import { getTrips } from "@/services/trip-service";
import { useStandardQuery } from "../useStandardQuery";

export const useGetTrips = () => {
    const { isPending, isError, data, error, status, refetch } = useStandardQuery({
        queryKey: [`trips`],
        queryConfig: { 
            params: null
        },
        queryFn: getTrips,
        enabled: true
    });

    return { isPending, isError, data, error, status, refetch };
}
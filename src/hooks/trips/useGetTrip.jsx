import { getTripById, getTrips } from "@/services/trip-service";
import { useStandardQuery } from "../useStandardQuery";

export const useGetTrip = (id) => {
    const { isPending, isError, data, error, status, refetch } = useStandardQuery({
        queryKey: [`trip`, id],
        queryConfig: { 
            params: {
                id: id
            }
        },
        queryFn: getTripById,
        enabled: !!id
    });

    return { isPending, isError, data, error, status, refetch };
}
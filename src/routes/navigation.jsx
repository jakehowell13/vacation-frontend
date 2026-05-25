import { Trip } from "@/components/trips/Trip";
import { Home } from "../components/home/Home";
import { Trips } from "../components/trips/Trips";

export const getNavigationRouteList = () => {

    return [
            {"path": "/", "component": <Home />},
            {"path": "/trips", "component": <Trips />},
            {"path": "/trip", "component": <Trip />}
        ];
}
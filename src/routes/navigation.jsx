import { Trip } from "@/components/trips/Trip";
import { Home } from "../components/home/Home";
import { Trips } from "../components/trips/Trips";
import { Calendar } from "@/calendar/Calendar";
import { FinanceDashboard } from "../components/finance/FinanceDashboard";

export const getNavigationRouteList = () => {

    return [
            {"path": "/", "component": <Home />},
            {"path": "/trips", "component": <Trips />},
            {"path": "/trip", "component": <Trip />},
            {"path": "/finance", "component": <FinanceDashboard />},
            {"path": "/calendar", "component": <Calendar />},
        ];
}
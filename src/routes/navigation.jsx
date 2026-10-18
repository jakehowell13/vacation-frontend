import { Trip } from "@/components/trips/Trip";
import { Home } from "../components/home/Home";
import { Trips } from "../components/trips/Trips";
import { Calendar } from "@/calendar/Calendar";
import { FinanceDashboard } from "../components/finance/FinanceDashboard";
import { Profile } from "@/components/profile/Profile";
import { VisionBoard } from "@/components/vision/VisionBoard";

export const getNavigationRouteList = () => {

    return [
            {"path": "/", "component": <Home />},
            {"path": "/trips", "component": <Trips />},
            {"path": "/trip", "component": <Trip />},
            {"path": "/finance", "component": <FinanceDashboard />},
            {"path": "/calendar", "component": <Calendar />},
            {"path": "/profile", "component": <Profile />},
            {"path": "/vision", "component": <VisionBoard />},
        ];
}

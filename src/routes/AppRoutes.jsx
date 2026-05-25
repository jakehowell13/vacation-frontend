import { Navigate, useLocation, Routes, Route } from "react-router-dom";
import { getNavigationRouteList } from "./navigation";

function AppRoutes() {
  const location = useLocation();
  const navigationRouteList = getNavigationRouteList();

  return (
      <Routes>
          {/* Protected routes - each wrapped with MsalAuthenticationTemplate */}
          {navigationRouteList.map((r, i) => 
              <Route key={i} path={r.path} element={r.component} />
          )}
      </Routes>
  );
}

export default AppRoutes;
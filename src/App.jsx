import { Layout } from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";
import { AuthGate } from "./components/auth/AuthGate";

function App() {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="dbtv-games-ui-theme">
    //   <ColorProvider defaultColor="system" storageKey="dbtv-games-ui-color">
    //     <MobileWidthProvider>
    //       <ExemptedPathsProvider>
          <AuthGate>
            <Layout>
              <AppRoutes isProtected={true} />
            </Layout>
          </AuthGate>
    //       </ExemptedPathsProvider>
    //     </MobileWidthProvider>
    //   </ColorProvider>
    // </ThemeProvider>
  );  
}

export default App

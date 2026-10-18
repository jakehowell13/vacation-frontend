import { Layout } from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";
import { AuthGate } from "./components/auth/AuthGate";
import { ProfileCompletionGate } from "./components/profile/ProfileCompletionGate";

function App() {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="dbtv-games-ui-theme">
    //   <ColorProvider defaultColor="system" storageKey="dbtv-games-ui-color">
    //     <MobileWidthProvider>
    //       <ExemptedPathsProvider>
          <AuthGate>
            <ProfileCompletionGate>
              <Layout>
                <AppRoutes isProtected={true} />
              </Layout>
            </ProfileCompletionGate>
          </AuthGate>
    //       </ExemptedPathsProvider>
    //     </MobileWidthProvider>
    //   </ColorProvider>
    // </ThemeProvider>
  );  
}

export default App

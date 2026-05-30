import { Layout } from "./components/Layout";
import { UserProvider } from "./providers/UserProvider";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="dbtv-games-ui-theme">
    //   <ColorProvider defaultColor="system" storageKey="dbtv-games-ui-color">
    //     <MobileWidthProvider>
    //       <ExemptedPathsProvider>
          <UserProvider defaultUser={null} storageKey="vcc-user-key">
            <Layout>
              <AppRoutes isProtected={true} />
            </Layout>
          </UserProvider>
    //       </ExemptedPathsProvider>
    //     </MobileWidthProvider>
    //   </ColorProvider>
    // </ThemeProvider>
  );  
}

export default App

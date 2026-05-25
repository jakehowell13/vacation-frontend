import { Layout } from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="dbtv-games-ui-theme">
    //   <ColorProvider defaultColor="system" storageKey="dbtv-games-ui-color">
    //     <MobileWidthProvider>
    //       <ExemptedPathsProvider>
            <Layout>
              <AppRoutes isProtected={true} />
            </Layout>
    //       </ExemptedPathsProvider>
    //     </MobileWidthProvider>
    //   </ColorProvider>
    // </ThemeProvider>
  );  
}

export default App

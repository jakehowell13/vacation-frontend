import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StrictMode } from 'react'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './providers/AuthProvider'
// import { MsalProvider } from '@azure/msal-react';
// import { msalConfig } from './auth-provider';
// import { PublicClientApplication, EventType } from '@azure/msal-browser'

const queryClient = new QueryClient();

// export const msalInstance = new PublicClientApplication(msalConfig);
// await msalInstance.initialize();

// // Add event callback to handle authentication events
// msalInstance.addEventCallback((event) => {
//   if (event.eventType === EventType.LOGIN_SUCCESS || 
//       event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
//     console.log('Authentication success:', event);
//   }
  
//   if (event.eventType === EventType.LOGIN_FAILURE || 
//       event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
//     console.error('Authentication failure:', event);
//   }
// });

// // Handle redirect promise on app initialization
// msalInstance.handleRedirectPromise().catch((error) => {
//   console.error("Error handling redirect promise:", error);
// });

// // msalConfig.initializeAccount(msalInstance);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <MsalProvider instance={msalInstance}> */}
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
    {/* </MsalProvider> */}
  </StrictMode>,
)

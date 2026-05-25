// import { EventType, LogLevel } from "@azure/msal-browser";

// export const msalConfig = {
//   auth: {
//     clientId: import.meta.env.VITE_CLIENT_ID,
//     authority: "https://login.microsoftonline.com/78b60cf0-904d-4b43-8ae5-d754cb2c8d48",
//     redirectUri: window.location.origin,
//     postLogoutRedirectUri: window.location.origin,
//   },
//   cache: {
//     cacheLocation: "localStorage",
//   },
//   system: {
//     iframeHashTimeout: 30000,
//     windowHashTimeout: 30000,
//     loadFrameTimeout: 30000,
//     loggerOptions: {
//       loggerCallback: (level, message, containsPii) => {
//         if (containsPii) return;

//         switch (level) {
//           case LogLevel.Error:
//             console.error(message);
//             return;
//           case LogLevel.Warning:
//             console.warn(message);
//             return;
//           case LogLevel.Info:
//             console.info(message);
//             return;
//           case LogLevel.Verbose:
//             console.debug(message);
//             return;
//           default:
//             return;
//         }
//       },
//       logLevel: LogLevel.Verbose,
//     },
//   },
// };

// /**
//  * Scopes for protected resources
//  */
// export const protectedResources = {
//     dbtvApi: {
//         scopes: [
//             import.meta.env.VITE_SCOPE
//         ],
//     },
// };

// export const loginRequest = {
//     scopes: protectedResources.dbtvApi.scopes,
// };


// export const logoutRequest = {
//     postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
// }

// export const silentRequestConfig = {
//   redirectUri: `${window.location.origin}/redirect.html`,
// };
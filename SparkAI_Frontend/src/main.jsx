import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import App from "./App";
import SetupRequired from "./components/SetupRequired";
import { ChatProvider } from "./hooks/useChat";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if Clerk key is properly configured
const isSetupComplete = clerkPubKey && 
  clerkPubKey !== 'pk_test_your_publishable_key_here' && 
  clerkPubKey.startsWith('pk_');

if (!isSetupComplete) {
  console.error('⚠️ Clerk publishable key not configured! Please check QUICK_SETUP.md for instructions.');
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {!isSetupComplete ? (
      <SetupRequired />
    ) : (
      <ClerkProvider publishableKey={clerkPubKey}>
        <ConvexProvider client={convex}>
          <BrowserRouter>
            <ChatProvider>
              <App />
            </ChatProvider>
          </BrowserRouter>
        </ConvexProvider>
      </ClerkProvider>
    )}
  </React.StrictMode>
);

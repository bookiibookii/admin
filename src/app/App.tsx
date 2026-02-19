import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="521863648387-va6lnj141f5vea7r9vqcf6kiivnoi1n4.apps.googleusercontent.com">
        <RouterProvider router={router} />
        <Toaster />
      </GoogleOAuthProvider>
    </>
  );
}

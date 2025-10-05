import QueryProvider from "../providers/QueryProvider";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "TaskTrackr Pro",
  description: "Fullstack Task Management App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

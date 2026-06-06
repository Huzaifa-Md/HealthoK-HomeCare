import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health oK Home Care Services",
  description:
    "Professional home healthcare services including nursing procedures, lab tests, injections, IV drips, vaccination, and patient care at home.",
  keywords:
    "home healthcare services, lab tests at home, nursing procedures at home, injection at home, IV drip at home, vaccination at home, home nurse near me, wound dressing at home, Ghaziabad",
  openGraph: {
    title: "Health oK Home Care Services",
    description:
      "Professional home healthcare services including nursing procedures, lab tests, injections, IV drips, vaccination, and patient care at home.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              background: "#1a1a2e",
              color: "#fff",
              fontSize: "14px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}

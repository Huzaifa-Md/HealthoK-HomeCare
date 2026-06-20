import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://patienthealthcare.online'),
  title: "Patient Care Home Services",
  description: "Professional home healthcare services including nursing procedures, injection services, vaccinations, health checkups, and lab tests at home.",
  keywords: "Patient Care Home Services, Home Healthcare, Nursing Services At Home, Injection Services At Home, Lab Tests At Home, Vaccination At Home, Healthcare Ghaziabad, Healthcare East Delhi",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Patient Care Home Services",
    description: "Professional home healthcare services including nursing procedures, injection services, vaccinations, health checkups, and lab tests at home.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Patient Care Home Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patient Care Home Services",
    description: "Professional home healthcare services including nursing procedures, injection services, vaccinations, health checkups, and lab tests at home.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "HealthcareService"],
  "name": "Patient Care Home Services",
  "areaServed": [
    { "@type": "City", "name": "Ghaziabad" },
    { "@type": "Place", "name": "Raj Nagar Extension" },
    { "@type": "Place", "name": "Rajendra Nagar" },
    { "@type": "Place", "name": "Shalimar Garden" },
    { "@type": "Place", "name": "Dilshad Garden" },
    { "@type": "Place", "name": "Shahdara" },
    { "@type": "Place", "name": "Mayur Vihar" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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

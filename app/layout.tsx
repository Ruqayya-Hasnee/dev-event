import LightRays from "@/components/LightRays";
import { Martian_Mono, Schibsted_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-sg",
});
const martianMono = Martian_Mono({
  variable: "--font-mm",
});

export const metadata = {
  title: "DevEvent",
  description: "The best event for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${schibstedGrotesk.variable} ${martianMono.variable}`}>
        <Navbar />
        <div className="absolute inset-0 top-0 min-h-screen">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.2}
            noiseAmount={0.0}
            distortion={0.01}
          />
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

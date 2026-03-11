import type { Metadata } from "next";
import { Inter, Noto_Color_Emoji } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
const notoEmoji = Noto_Color_Emoji({ weight: "400", subsets: ["emoji"], variable: "--font-emoji" });

export const metadata: Metadata = {
  title: "SlideFlow - Digital Signage Platform",
  description: "Turn any screen into a dynamic display with SlideFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${notoEmoji.variable}`} style={{ fontFamily: `${inter.style.fontFamily}, var(--font-emoji), sans-serif` }}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}

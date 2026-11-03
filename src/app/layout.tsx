import type { Metadata, Viewport } from "next";
import { Anton, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const body = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "tokenhood.online"}`),
  title: { default: "Tokenhood: meme sites paid in $HOOD", template: "%s | Tokenhood" },
  description: "Launch a website for your meme or token in minutes. Pay once in $HOOD, share your page.",
};
export const viewport: Viewport = { themeColor: "#000000" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

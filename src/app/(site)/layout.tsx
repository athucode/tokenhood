import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** Tokenhood chrome (header + footer). Token pages live in (token) and don't get it. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

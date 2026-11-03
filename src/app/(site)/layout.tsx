import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getHoodInfo } from "@/lib/hood-live";

/** Tokenhood chrome (header + footer). Token pages live in (token) and don't get it. */
/** Footer shows live $HOOD info from the /hood page, so these pages render per request. */
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const info = await getHoodInfo();
  return (
    <div className="site-chrome">
      <Header />
      {children}
      <Footer info={info} />
    </div>
  );
}

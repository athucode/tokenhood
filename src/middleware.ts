import { NextResponse, type NextRequest } from "next/server";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "tokenhood.online";
const IGNORED = new Set(["www", "app"]);

/**
 * - Old links: /p/corner-cat -> 301 /corner-cat.
 * - Subdomain routing: corner-cat.tokenhood.online -> /corner-cat
 *   (requires a wildcard domain *.tokenhood.online on the Vercel project).
 */
export function middleware(req: NextRequest) {
  const legacy = req.nextUrl.pathname.match(/^\/p\/([^/]+)\/?$/);
  if (legacy) {
    const url = req.nextUrl.clone();
    url.pathname = `/${legacy[1]}`;
    return NextResponse.redirect(url, 301);
  }

  const host = (req.headers.get("host") ?? "").split(":")[0];
  if (host.endsWith(`.${ROOT}`)) {
    const sub = host.slice(0, -(ROOT.length + 1));
    if (sub && !sub.includes(".") && !IGNORED.has(sub)) {
      const url = req.nextUrl.clone();
      url.pathname = `/${sub}`;
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/((?!_next|api|.*\\..*).*)"] };

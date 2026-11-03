import { NextResponse, type NextRequest } from "next/server";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "tokenhood.online";
const IGNORED = new Set(["www", "app"]);

/**
 * Subdomain routing: corner-cat.tokenhood.online -> /p/corner-cat.
 * Requires a wildcard domain (*.tokenhood.online) added to the Vercel project.
 */
export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").split(":")[0];
  if (host.endsWith(`.${ROOT}`)) {
    const sub = host.slice(0, -(ROOT.length + 1));
    if (sub && !sub.includes(".") && !IGNORED.has(sub)) {
      const url = req.nextUrl.clone();
      url.pathname = `/p/${sub}`;
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/((?!_next|api|.*\\..*).*)"] };

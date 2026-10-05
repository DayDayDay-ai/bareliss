import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "laser/", "zones/", "prices/", "about/", "contacts/"].map(
    (path) => ({
      url: siteUrl + "/" + path,
    }),
  );
}

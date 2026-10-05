import Site from "@/components/Site";
import { siteUrl } from "@/lib/site";
export const metadata = {
  title: "Зоны эпиляции",
  alternates: { canonical: siteUrl + "/zones/" },
};
export default function Page() {
  return <Site focus="zones" />;
}

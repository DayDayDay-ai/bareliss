import Site from "@/components/Site";
import {siteUrl} from "@/lib/site";
export const metadata = {
  title: "Цены",
  alternates: { canonical: siteUrl + "/prices/" },
};
export default function Page() {
  return <Site focus="prices" />;
}


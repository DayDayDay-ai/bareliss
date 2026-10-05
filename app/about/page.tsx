import Site from "@/components/Site";
import {siteUrl} from "@/lib/site";
export const metadata = {
  title: "О студии",
  alternates: { canonical: siteUrl + "/about/" },
};
export default function Page() {
  return <Site focus="about" />;
}


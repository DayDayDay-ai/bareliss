import Site from "@/components/Site";
import {siteUrl} from "@/lib/site";
export const metadata = {
  title: "Как работает лазер",
  alternates: { canonical: siteUrl + "/laser/" },
};
export default function Page() {
  return <Site focus="laser" />;
}


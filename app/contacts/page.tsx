import Site from "@/components/Site";
import {siteUrl} from "@/lib/site";
export const metadata = {
  title: "Контакты",
  alternates: { canonical: siteUrl + "/contacts/" },
};
export default function Page() {
  return <Site focus="contacts" />;
}


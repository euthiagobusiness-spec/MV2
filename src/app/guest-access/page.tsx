import { GuestAccessPage } from "@/components/guest/GuestAccessPage";
import { getPublicProperties } from "@/lib/data/guest";

export default async function Page() {
  const properties = await getPublicProperties();

  return <GuestAccessPage properties={properties} />;
}

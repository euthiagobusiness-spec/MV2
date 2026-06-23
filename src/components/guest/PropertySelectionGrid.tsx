import type { Property } from "@/lib/types";

import { PropertySelectionCard } from "./PropertySelectionCard";

export function PropertySelectionGrid({ properties }: { properties: Property[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {properties.map((property) => (
        <PropertySelectionCard key={property.id} property={property} />
      ))}
    </div>
  );
}

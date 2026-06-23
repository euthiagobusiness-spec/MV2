import { cn } from "@/lib/utils";

type PortalSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function PortalSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: PortalSectionProps) {
  return (
    <section className={cn("scroll-mt-24 py-7", className)} id={id}>
      <div className="mb-4">
        {eyebrow ? (
          <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-2xl font-black text-teal-950">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-3xl leading-7 text-slate-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

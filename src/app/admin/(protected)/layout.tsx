import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/data/admin";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="admin-shell lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminHeader user={user} />
        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

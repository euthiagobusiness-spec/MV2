type DataTableProps = {
  columns: string[];
  children: React.ReactNode;
};

export function DataTable({ columns, children }: DataTableProps) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-teal-50 text-xs uppercase tracking-[0.12em] text-teal-900">
            <tr>
              {columns.map((column) => (
                <th className="px-4 py-3 font-black" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

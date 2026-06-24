import { cn } from "@/lib/utils";

export function DataTable({
  headers,
  children,
  minWidth = "min-w-[680px]",
}: {
  headers: string[];
  children: React.ReactNode;
  minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className={cn("w-full border-collapse text-left text-sm", minWidth)}>
        <thead className="border-b border-border bg-surface-muted text-xs text-muted">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-extrabold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function Cell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-3 py-3 align-top sm:px-4 sm:py-3.5", className)}>{children}</td>;
}

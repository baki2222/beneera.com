const statusStyles: Record<string, string> = {
  // Order fulfillment
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  shipped: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  cancelled: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  refunded: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  // Payment
  paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  // Inquiry
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  open: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  replied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  closed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  // Stock
  in_stock: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  low_stock: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  out_of_stock: 'bg-red-500/10 text-red-400 border-red-500/20',
  // General
  active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  inactive: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  published: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  draft: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  // Roles
  owner: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  admin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  staff: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const labelMap: Record<string, string> = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
};

export default function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || 'bg-zinc-800 text-zinc-400 border-zinc-700';
  const label = labelMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${style}`}>
      {label}
    </span>
  );
}

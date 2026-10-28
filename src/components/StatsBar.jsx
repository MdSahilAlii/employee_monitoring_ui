export default function StatsBar({ stats }) {
  if (!stats) return null;

  const items = [
    { label: "Total employees", value: stats.total },
    { label: "Active", value: stats.active },
    { label: "On leave", value: stats.on_leave },
    { label: "Resigned", value: stats.resigned },
    {
      label: "Average salary",
      value: stats.average_salary.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 border border-slate-300 bg-white rounded-md divide-x divide-slate-200">
      {items.map((item) => (
        <div key={item.label} className="px-4 py-3">
          <div className="text-xs text-slate-500">{item.label}</div>
          <div className="text-xl font-semibold mt-1">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

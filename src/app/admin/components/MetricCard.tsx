type Props = {
  title: string;
  value: string | number;
};

export default function MetricCard({ title, value }: Props) {
  return (
    <div className="bg-white shadow rounded-xl p-6 hover:shadow-md transition-shadow">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
    </div>
  );
}
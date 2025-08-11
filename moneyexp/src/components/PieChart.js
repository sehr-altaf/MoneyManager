import { PieChart as  RePieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4CAF50", "#FF5722", "#2196F3", "#FFC107"];

const PieChart = ({ transactions }) => {
  const data = transactions.reduce((acc, tx) => {
    const existing = acc.find(item => item.name === tx.category);
    if (existing) {
      existing.value += Number(tx.amount);
    } else {
      acc.push({ name: tx.category, value: Number(tx.amount) });
    }
    return acc;
  }, []);

  return (
    <div className="chart-card">
      <h3>Category Breakdown</h3>
      <RePieChart width={300} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </RePieChart>
    </div>
  );
};
export default PieChart;

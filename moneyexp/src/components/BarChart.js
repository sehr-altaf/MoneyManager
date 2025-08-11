import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const BarChart = ({ transactions }) => {
  const monthlyData = {};

  transactions.forEach(tx => {
    const month = new Date(tx.date).toLocaleString("default", { month: "short" });
    if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
    if (tx.type === "income") {
      monthlyData[month].income += Number(tx.amount);
    } else {
      monthlyData[month].expense += Number(tx.amount);
    }
  });

  const data = Object.entries(monthlyData).map(([month, values]) => ({
    month,
    ...values,
  }));

  return (
    <div className="chart-card">
      <h3>Monthly Overview</h3>
      <ReBarChart width={400} height={250} data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#4CAF50" />
        <Bar dataKey="expense" fill="#FF5722" />
      </ReBarChart>
    </div>
  );
};
export default BarChart;

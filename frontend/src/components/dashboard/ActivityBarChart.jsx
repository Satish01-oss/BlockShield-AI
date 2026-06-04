import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const data = [
  { name: 'BTC', transactions: 240 },
  { name: 'ETH', transactions: 180 },
  { name: 'BNB', transactions: 120 },
  { name: 'SOL', transactions: 90 },
]

const ActivityBarChart = () => {
  return (
    <div className="w-full h-[320px]">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
          />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
          />

          <Tooltip />

          <Bar
            dataKey="transactions"
            fill="#8b5cf6"
            radius={[10, 10, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  )
}

export default ActivityBarChart
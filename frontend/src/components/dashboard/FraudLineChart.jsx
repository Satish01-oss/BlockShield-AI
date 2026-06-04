import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const data = [
  { day: 'Mon', fraud: 12 },
  { day: 'Tue', fraud: 19 },
  { day: 'Wed', fraud: 9 },
  { day: 'Thu', fraud: 27 },
  { day: 'Fri', fraud: 18 },
  { day: 'Sat', fraud: 34 },
  { day: 'Sun', fraud: 21 },
]

const FraudLineChart = () => {
  return (
    <div className="w-full h-[320px]">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
          />

          <XAxis
            dataKey="day"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="fraud"
            stroke="#06b6d4"
            strokeWidth={4}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}

export default FraudLineChart
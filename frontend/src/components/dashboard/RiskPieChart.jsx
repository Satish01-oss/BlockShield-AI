import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const data = [
  { name: 'Safe', value: 70 },
  { name: 'Medium', value: 20 },
  { name: 'High', value: 10 },
]

const COLORS = [
  '#22c55e',
  '#eab308',
  '#ef4444',
]

const RiskPieChart = () => {
  return (
    <div className="w-full h-[320px]">

      <ResponsiveContainer width="100%" height="100%">

        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
          >

            {
              data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))
            }

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  )
}

export default RiskPieChart
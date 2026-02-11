"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Building2 } from "lucide-react"

interface ChartData {
  status: string
  total: number
}

export default function DudiStatusChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)

    const { data, error } = await supabase
      .from("dudi")
      .select("status")

    if (error) {
      console.error("Error fetch dudi:", error)
      setLoading(false)
      return
    }

    const grouped = data.reduce((acc: any, curr: any) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1
      return acc
    }, {})

    const formatted = Object.keys(grouped).map((key) => ({
      status: key,
      total: grouped[key],
    }))

    setData(formatted)
    setLoading(false)
  }

  const totalDudi = data.reduce((sum, item) => sum + item.total, 0)

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="text-gray-500 text-sm">Memuat statistik...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Statistik DUDI
          </h2>
          <p className="text-sm text-gray-500">
            Berdasarkan status persetujuan
          </p>
        </div>

        <div className="flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-xl text-sm font-medium">
          <Building2 className="w-4 h-4" />
          Total: {totalDudi}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="status"
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
              }}
            />
            <Bar
              dataKey="total"
              fill="#06b6d4"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend custom */}
      <div className="flex flex-wrap gap-3 pt-2">
        {data.map((item) => (
          <div
            key={item.status}
            className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-600"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            {item.status} ({item.total})
          </div>
        ))}
      </div>

    </div>
  )
}

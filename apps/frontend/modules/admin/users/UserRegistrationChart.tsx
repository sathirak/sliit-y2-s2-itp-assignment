"use client"

import { useMemo } from "react"
import { format, startOfDay, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/modules/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { UserDto } from "@/lib/dtos/user"

interface UserRegistrationChartProps {
  users: UserDto[]
  className?: string
}

export function UserRegistrationChart({ users, className }: UserRegistrationChartProps) {
  const chartData = useMemo(() => {
    // Get current month date range
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    
    // Generate all days in current month
    const daysInMonth = eachDayOfInterval({
      start: monthStart,
      end: monthEnd,
    })
    
    // Count users registered per day
    const userCountsByDay = new Map<string, number>()
    
    // Initialize all days with 0
    daysInMonth.forEach((day) => {
      const dayKey = format(day, 'yyyy-MM-dd')
      userCountsByDay.set(dayKey, 0)
    })
    
    // Count actual registrations
    users.forEach((user) => {
      if (user.createdAt) {
        const userDate = new Date(user.createdAt)
        const dayStart = startOfDay(userDate)
        
        // Only count if within current month and user is not deleted
        if (dayStart >= monthStart && dayStart <= monthEnd && !user.isDeleted) {
          const dayKey = format(dayStart, 'yyyy-MM-dd')
          const currentCount = userCountsByDay.get(dayKey) || 0
          userCountsByDay.set(dayKey, currentCount + 1)
        }
      }
    })
    
    // Convert to chart data format - show every 3rd day for cleaner display
    return daysInMonth.map((day, index) => {
      const dayKey = format(day, 'yyyy-MM-dd')
      return {
        date: format(day, 'MMM dd'),
        shortDate: format(day, 'dd'), // Just day number for cleaner labels
        users: userCountsByDay.get(dayKey) || 0,
        fullDate: dayKey,
        shouldShowLabel: index % 3 === 0 || index === daysInMonth.length - 1, // Show every 3rd day
      }
    })
  }, [users])

  const chartConfig = {
    users: {
      label: "New Users",
      color: "hsl(var(--primary))",
    },
  }

  const totalUsers = users.filter(user => !user.isDeleted).length
  const currentMonthUsers = useMemo(() => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    
    return users.filter(user => {
      if (!user.createdAt || user.isDeleted) return false
      const userDate = new Date(user.createdAt)
      return userDate >= monthStart && userDate <= monthEnd
    }).length
  }, [users])

  return (
    <div className={className}>
      <div className="mb-8">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">User Registrations</h3>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(), 'MMMM yyyy')} • Total users: {totalUsers}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{currentMonthUsers}</div>
            <div className="text-sm text-gray-500">this month</div>
          </div>
        </div>
      </div>
      
      <ChartContainer
        config={chartConfig}
        className="h-[350px] w-full"
      >
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="shortDate"
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
            interval={2} // Show every 3rd label
            tickFormatter={(value, index) => {
              // Only show ticks for certain positions to avoid crowding
              return index % 3 === 0 ? value : '';
            }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            domain={[0, 'dataMax + 1']}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value, name) => [
              `${value} user${value !== 1 ? 's' : ''}`,
              "New Registrations"
            ]}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                const fullDate = payload[0]?.payload?.fullDate
                if (fullDate) {
                  return format(new Date(fullDate), 'EEEE, MMMM do')
                }
              }
              return label
            }}
          />
          <Bar
            dataKey="users"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
"use client"

import { useMemo } from "react"
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { UserDto } from "@/lib/dtos/user"
import { Users, UserPlus, TrendingUp, Calendar } from "lucide-react"

interface UserStatsCardsProps {
  users: UserDto[]
  className?: string
}

export function UserStatsCards({ users, className }: UserStatsCardsProps) {
  const stats = useMemo(() => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const yearStart = startOfYear(now)
    const yearEnd = endOfYear(now)
    
    const activeUsers = users.filter(user => !user.isDeleted)
    
    const thisMonthUsers = activeUsers.filter(user => {
      if (!user.createdAt) return false
      const userDate = new Date(user.createdAt)
      return userDate >= monthStart && userDate <= monthEnd
    })
    
    const thisYearUsers = activeUsers.filter(user => {
      if (!user.createdAt) return false
      const userDate = new Date(user.createdAt)
      return userDate >= yearStart && userDate <= yearEnd
    })
    
    // Calculate percentage growth rate (mock calculation for demo)
    const growthRate = thisMonthUsers.length > 0 ? 
      Math.round(((thisMonthUsers.length / Math.max(activeUsers.length - thisMonthUsers.length, 1)) * 100)) : 0
    
    return {
      total: activeUsers.length,
      thisMonth: thisMonthUsers.length,
      thisYear: thisYearUsers.length,
      growthRate,
    }
  }, [users])

  const cards = [
    {
      title: "Total Users",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Active users",
    },
    {
      title: "This Month",
      value: stats.thisMonth,
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "New signups",
    },
    {
      title: "This Year",
      value: stats.thisYear,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Year to date",
    },
    {
      title: "Growth Rate",
      value: `${stats.growthRate}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Monthly growth",
    },
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold mb-1">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <div className={`${card.bgColor} ${card.color} p-3 rounded-full`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
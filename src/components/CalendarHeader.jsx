"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, onToday, onDateSelect }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const isCurrentMonth = (date) => {
    const today = new Date()
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const calendar = []
    let day = 1

    for (let i = 0; i < 6; i++) {
      const week = []
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          week.push(<td key={`empty-${j}`} className="p-2"></td>)
        } else if (day > daysInMonth) {
          break
        } else {
          const date = new Date(year, month, day)
          week.push(
            <td key={day} className="p-2">
              <button
                className={`w-8 h-8 rounded-full ${
                  date.toDateString() === currentDate.toDateString() ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  onDateSelect(date)
                  setIsCalendarOpen(false)
                }}
              >
                {day}
              </button>
            </td>,
          )
          day++
        }
      }
      calendar.push(<tr key={i}>{week}</tr>)
      if (day > daysInMonth) break
    }

    return calendar
  }

  return (
    <div className="flex items-center justify-between p-4  bg-gray-100">
      <div className="flex items-center gap-4">
        <button className="p-1  rounded-full  hover:bg-blue-100" onClick={onPrevMonth}>
          <ChevronLeft className="w-7 cursor-pointer text-blue-600 h-10" />
        </button>
        <div className="relative">
          <button
            className={`px-4  py-2 text-2xl hover:text-blue-300 cursor-pointer rounded ${isCurrentMonth(currentDate) ?  "text-blue-500" : ""}`}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </button>
          {isCalendarOpen && (
            <div className="absolute  z-30 mt-2 bg-white border rounded shadow-lg">
              <table className="border-collapse">
                <thead>
                  <tr>
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <th key={day} className="p-2">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{renderCalendar()}</tbody>
              </table>
            </div>
          )}
        </div>
        <button className="p-2 hover:bg-blue-100 rounded-full " onClick={onNextMonth}>
          <ChevronRight className="w-7 cursor-pointer  text-blue-600 h-10" />
        </button>
      </div>
      <button onClick={onToday} className=" cursor-pointer px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50">
        Today
      </button>
    </div>
  )
}

export default CalendarHeader


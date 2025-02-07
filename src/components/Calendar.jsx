"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import CalendarHeader from "./CalendarHeader"
import CalendarGrid from "./CalendarGrid"
import AddResource from "./AddResource"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [resources, setResources] = useState([
    { id: "a", name: "Resource A" },
    { id: "b", name: "Resource B" },
    { id: "c", name: "Resource C" },
    { id: "d", name: "Resource D" },
    { id: "e", name: "Resource E" },
    { id: "f", name: "Resource F" },
    { id: "g", name: "Resource G" },
    { id: "h", name: "Resource H" },
    { id: "i", name: "Resource I" },
  ])
  const [events, setEvents] = useState([
    {
      id: 1,
      resourceId: "a",
      start: new Date(2025, 0, 10, 9, 0),
      end: new Date(2025, 0, 13, 17, 0),
      title: "Event 1",
      color: "bg-blue-100",
    },
    {
      id: 2,
      resourceId: "b",
      start: new Date(2025, 0, 11, 10, 0),
      end: new Date(2025, 0, 12, 16, 0),
      title: "Event 2",
      color: "bg-green-100",
    },
  ])

  const calendarRef = useRef(null)

  const scrollToDate = useCallback((date) => {
    if (calendarRef.current) {
      const dateString = date.toISOString().split("T")[0]
      const dateElement = calendarRef.current.querySelector(`[data-date="${dateString}"]`)
      if (dateElement) {
        dateElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [])

  const handleDateSelect = (newDate) => {
    setSelectedDate(newDate)
    setCurrentDate(newDate)
    setTimeout(() => scrollToDate(newDate), 0)
  }

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
    setTimeout(() => scrollToDate(today), 0)
  }

  const handleAddResource = () => {
    const lastResourceLetter = resources[resources.length - 1].name.slice(-1)
    const nextLetter = String.fromCharCode(lastResourceLetter.charCodeAt(0) + 1)
    const newResource = {
      id: nextLetter.toLowerCase(),
      name: `Resource ${nextLetter}`,
    }
    setResources((prev) => [...prev, newResource])
  }

  const handleAddEvent = (event) => {
    setEvents((prev) => [...prev, { ...event, id: Date.now() }])
  }

  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
  }

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  useEffect(() => {
    scrollToDate(new Date())
  }, [scrollToDate])

  return (
    <div className="flex flex-col h-screen">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onDateSelect={handleDateSelect}
      />
      <AddResource onAddResource={handleAddResource} />
      <div ref={calendarRef} className="flex-1 overflow-auto">
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          resources={resources}
          events={events}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          onDateSelect={handleDateSelect}
        />
      </div>
    </div>
  )
}

export default Calendar


import React from "react";
import CalendarEvent from "./CalendarEvent";

// Array of Tailwind color classes for events
const eventColors = [
  { bg: 'bg-blue-100', hoverBg: 'hover:bg-blue-200' },
  { bg: 'bg-green-100', hoverBg: 'hover:bg-green-200' },
  { bg: 'bg-purple-100', hoverBg: 'hover:bg-purple-200' },
  { bg: 'bg-pink-100', hoverBg: 'hover:bg-pink-200' },
  { bg: 'bg-yellow-100', hoverBg: 'hover:bg-yellow-200' },
  { bg: 'bg-indigo-100', hoverBg: 'hover:bg-indigo-200' },
  { bg: 'bg-red-100', hoverBg: 'hover:bg-red-200' },
  { bg: 'bg-orange-100', hoverBg: 'hover:bg-orange-200' },
];

const CalendarGrid = ({
  currentDate,
  selectedDate,
  resources,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onDateSelect,
}) => {
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentDate);
  const dates = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
  );

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * eventColors.length);
    return eventColors[randomIndex];
  };

  const isCurrentDay = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDay = (date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getDayName = (date) => new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);

  const handleDoubleClick = (date, resourceId) => {
    const { bg, hoverBg } = getRandomColor();
    const newEvent = {
      id: Date.now(),
      resourceId,
      start: date,
      end: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      title: "New Event",
      color: bg,
      hoverColor: hoverBg,
    };
    onAddEvent(newEvent);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, date, resourceId) => {
    e.preventDefault();
    const eventId = Number.parseInt(e.dataTransfer.getData("text/plain"), 10);
    const draggedEvent = events.find((event) => event.id === eventId);

    if (draggedEvent) {
      const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
      const newStart = new Date(date);
      newStart.setHours(draggedEvent.start.getHours(), draggedEvent.start.getMinutes());
      const newEnd = new Date(newStart.getTime() + duration);

      onUpdateEvent({
        ...draggedEvent,
        start: newStart,
        end: newEnd,
        resourceId: resourceId,
      });
    }
  };

  return (
    <div className="grid border border-[#E5E5E5] grid-cols-[auto_2fr]">
      <div className="sticky bg-white z-20 left-0">
        <div className="h-10 sticky border-r border-b border-[#E5E5E5] flex items-center justify-center font-medium w-[150px]"></div>
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="h-16 text-sm bg-white font-bold border-r border-b border-[#E5E5E5] w-[150px] flex items-center px-2"
          >
            {resource.name}
          </div>
        ))}
      </div>
      <div className="overflow-visible">
        <div
          className="grid"
          style={{ position: "sticky", gridTemplateColumns: `repeat(${dates.length}, minmax(80px, 1fr))` }}
        >
          {dates.map((date) => (
            <div
              key={date.getTime()}
              className="sticky top-0 z-20 bg-white border-b border-r border-[#E5E5E5]"
              data-date={date.toISOString().split("T")[0]}
              onClick={() => onDateSelect(date)}
            >
              <div className="h-10 flex items-center justify-center">
                <div
                  className={`flex flex-col items-center justify-center rounded-full w-8 h-8 ${
                    isCurrentDay(date) ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="text-xs font-medium">{date.getDate()}</div>
                  <div className="text-[10px]">{getDayName(date)}</div>
                </div>
              </div>
            </div>
          ))}
          {resources.map((resource) => (
            <React.Fragment key={resource.id}>
              {dates.map((date) => (
                <div
                  key={`${resource.id}-${date.getTime()}`}
                  className={`h-16 border-b border-r border-[#E5E5E5] relative ${
                    isCurrentDay(date)
                  } ${isSelectedDay(date) ? "" : ""}`}
                  onDoubleClick={() => handleDoubleClick(date, resource.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, date, resource.id)}
                >
                  {events
                    .filter(
                      (event) =>
                        event.resourceId === resource.id &&
                        event.start.getDate() === date.getDate() &&
                        event.start.getMonth() === date.getMonth() &&
                        event.start.getFullYear() === date.getFullYear()
                    )
                    .map((event) => (
                      <CalendarEvent key={event.id} event={event} onUpdate={onUpdateEvent} onDelete={onDeleteEvent} />
                    ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
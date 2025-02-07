"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

const CalendarEvent = ({ event, onUpdate, onDelete, dayWidth = 100 }) => {
  const eventRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialStart, setInitialStart] = useState(event.start);
  const [initialEnd, setInitialEnd] = useState(event.end);
  const [resizeEdge, setResizeEdge] = useState(null);
  const [previewDates, setPreviewDates] = useState({ start: event.start, end: event.end });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showResizeHandles, setShowResizeHandles] = useState(false);

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const MS_PER_PIXEL = MS_PER_DAY / dayWidth;

  // Check if the event was created recently (within the last 5 seconds)
  const isNewEvent = Date.now() - event.id < 5000;

  useEffect(() => {
    setPreviewDates({ start: event.start, end: event.end });
  }, [event.start, event.end]);

  const handleResizeStart = (e, edge) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeEdge(edge);
    setStartX(e.clientX);
    setInitialStart(new Date(event.start));
    setInitialEnd(new Date(event.end));
    document.body.style.cursor = "ew-resize";
  };

  const roundToNearestMinutes = (date, minutes = 15) => {
    const ms = 1000 * 60 * minutes;
    return new Date(Math.round(date.getTime() / ms) * ms);
  };

  const handleResize = (e) => {
    if (!isResizing || !eventRef.current) return;

    const diff = e.clientX - startX;
    const timeDiff = diff * MS_PER_PIXEL;
    const minDuration = 30 * 60 * 1000; // 30 minutes minimum duration

    if (resizeEdge === "right") {
      const newEnd = new Date(initialEnd.getTime() + timeDiff);
      const roundedEnd = roundToNearestMinutes(newEnd);

      if (roundedEnd > event.start && roundedEnd.getTime() - event.start.getTime() >= minDuration) {
        setPreviewDates((prev) => ({ ...prev, end: roundedEnd }));
        onUpdate({ ...event, end: roundedEnd });
      }
    } else if (resizeEdge === "left") {
      const newStart = new Date(initialStart.getTime() + timeDiff);
      const roundedStart = roundToNearestMinutes(newStart);

      if (roundedStart < event.end && event.end.getTime() - roundedStart.getTime() >= minDuration) {
        setPreviewDates((prev) => ({ ...prev, start: roundedStart }));
        onUpdate({ ...event, start: roundedStart });
      }
    }

    if (eventRef.current) {
      eventRef.current.style.opacity = "0.8";
      eventRef.current.style.transform = "scale(1.02)";
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeEdge(null);
    document.body.style.cursor = "default";
    if (eventRef.current) {
      eventRef.current.style.opacity = "1";
      eventRef.current.style.transform = "none";
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartX(e.clientX);
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", event.id.toString());
      e.dataTransfer.effectAllowed = "move";
    }

    if (eventRef.current) {
      eventRef.current.style.opacity = "0.5";
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (eventRef.current) {
      eventRef.current.style.boxShadow = "none";
      eventRef.current.style.opacity = "1";
      eventRef.current.style.transform = "none";
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", handleResizeEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isResizing]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(event.id);
    setIsDeleteDialogOpen(false);
  };

  const duration = Math.max(1, (previewDates.end.getTime() - previewDates.start.getTime()) / MS_PER_DAY);

  return (
    <>
      <div
        ref={eventRef}
        className={`absolute h-11 cursor-pointer rounded-md m-1 p-1 text-xs cursor-move transition-all duration-200 
          ${event.color} 
          ${isHovered ? event.hoverColor : ''} 
          ${isResizing ? "shadow-lg opacity-80" : ""}`}
        style={{
          width: `calc(${duration} * 100% - 2px)`,
          zIndex: isDragging || isResizing ? 1000 : 1,
        }}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => {
          setShowResizeHandles(true);
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setShowResizeHandles(false);
          setIsHovered(false);
        }}
      >
        <div className={`${isNewEvent || event.title === "New Event" ? "font-bold" : "font-medium"} truncate`}>
          {event.title}
        </div>
        <div className="text-gray-600 truncate">
          {formatTime(previewDates.start)} - {formatTime(previewDates.end)}
        </div>

        <button 
          className="absolute top-1 right-1 h-4 w-4 rounded-full p-0 hover:bg-gray-200 flex items-center justify-center" 
          onClick={handleDeleteClick}
        >
          <X className="h-3 cursor-pointer w-3" />
        </button>

        {showResizeHandles && (
          <>
            <div
              className="absolute left-0 top-5 w-2 h-2 rounded-full border border-blue-500 bg-white cursor-ew-resize transition-all"
              onMouseDown={(e) => handleResizeStart(e, "left")}
            />
            <div
              className="absolute right-0 top-5 w-2 h-2 rounded-full border border-blue-500 bg-white cursor-ew-resize transition-all"
              onMouseDown={(e) => handleResizeStart(e, "right")}
            />
          </>
        )}
      </div>

      {isDeleteDialogOpen && (
        <div 
          className="fixed inset-0 border-r border-black-500 bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteDialogOpen(false);
          }}
        >
          <div 
            className="bg-white border border-black-100 rounded-lg p-6 max-w-sm w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Delete Event</h3>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                <X className="w-5 cursor-pointer h-5" />
              </button>
            </div>
            <p className="mb-6">Are you sure you want to delete this event?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 cursor-pointer bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarEvent;
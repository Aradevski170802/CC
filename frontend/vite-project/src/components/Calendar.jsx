import React, { useState, useEffect } from "react";
import { Calendar as FullCalendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/calendar.css";

const Calendar = ({ username, token }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) {
      console.error("Calendar element not found.");
      return;
    }

    const calendar = new FullCalendar(calendarEl, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth", // Only keep the month view
      },
      events: events,
      selectable: true,
      dateClick: handleDayClick,
    });

    calendar.render();

    // Ensure calendar resizes properly
    const resizeObserver = new ResizeObserver(() => {
      calendar.updateSize();
    });
    resizeObserver.observe(calendarEl);

    return () => {
      calendar.destroy();
      resizeObserver.disconnect();
    };
  }, [events]);

  const handleDayClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    if (clickedDate < today) {
      alert("You cannot book appointments in the past.");
      return;
    }

    // Update time slots based on the clicked date
    const slots = generateTimeSlots();
    setSelectedDay(clickedDate.toDateString());
    setTimeSlots(slots);
  };

  const generateTimeSlots = () => {
    const slots = [];
    let current = new Date();
    current.setHours(7, 0, 0, 0);
    while (
      current.getHours() < 23 ||
      (current.getHours() === 23 && current.getMinutes() === 0)
    ) {
      slots.push({ time: current.toTimeString().slice(0, 5), available: true });
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  const handleSlotSelection = (slot) => {
    if (!slot.available) {
      alert("This slot is already booked.");
      return;
    }

    setTimeSlots((prevSlots) =>
      prevSlots.map((s) =>
        s.time === slot.time
          ? { ...s, isSelected: true }
          : { ...s, isSelected: false }
      )
    );
    setSelectedSlot(slot);
  };

  return (
    <div className="calendar-container" id="calendar-container">
      <h1>Welcome, {username}</h1>
      <div id="calendar"></div>
      {selectedDay && (
        <div className="day-view">
          <h2>Available Time Slots for {selectedDay}</h2>
          <div className="time-slots">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`time-slot ${slot.isSelected ? "selected" : ""} ${
                  slot.available ? "" : "unavailable"
                }`}
                disabled={!slot.available}
                onClick={() => handleSlotSelection(slot)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

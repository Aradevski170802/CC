import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../styles/calendar.css";

const CalendarPage = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to system date

  // Fetch the current date dynamically from the World Time API
  const fetchCurrentDate = async () => {
    try {
      const response = await fetch("https://worldtimeapi.org/api/ip");
      if (!response.ok) {
        throw new Error("Failed to fetch current date");
      }
      const data = await response.json();
      setCurrentDate(new Date(data.datetime)); // Set current date from API response
    } catch (error) {
      console.error("Error fetching current date:", error);
    }
  };

  // Fetch the current date when the component mounts
  useEffect(() => {
    fetchCurrentDate();
  }, []);

  const handleDayClick = (date) => {
    const today = new Date();
    setErrorMessage(""); // Clear previous errors

    // Prevent selecting past or current days
    if (date <= today.setHours(0, 0, 0, 0)) {
      setErrorMessage("Booking unavailable for the selected date.");
      setSelectedDay(null); // Clear selected day
      return;
    }

    setSelectedDay(date.toISOString().split("T")[0]); // Set the clicked date
    setTimeSlot(""); // Clear time slot

    // Update currentDate to the selected date to sync dropdowns and calendar view
    setCurrentDate(date);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date()); // Reset to today's date
  };

  const handleMonthChange = (event) => {
    const selectedMonth = parseInt(event.target.value, 10);
    setCurrentDate(
      new Date(currentDate.getFullYear(), selectedMonth, currentDate.getDate())
    );
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value, 10);
    setCurrentDate(
      new Date(selectedYear, currentDate.getMonth(), currentDate.getDate())
    );
  };

  const handleBookAppointment = () => {
    console.log(`Appointment booked for ${selectedDay} at ${timeSlot}`);
    setSelectedDay(null);
    setTimeSlot("");
  };

  return (
    <div className="calendar-page">
      <div className="content">
        <div className="calendar-container" style={{ height: "400px" }}>
          {/* Custom navigation with month and year dropdowns */}
          <div className="custom-navigation">
            <select
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className="month-dropdown"
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="year-dropdown"
            >
              {Array.from(
                { length: 3001 - new Date().getFullYear() },
                (_, i) => {
                  const year = new Date().getFullYear() + i; // Start from current year
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                }
              )}
            </select>
            <button className="today-button" onClick={handleTodayClick}>
              Today
            </button>
          </div>

          {/* Calendar Component */}
          <Calendar
            key={currentDate?.toISOString()} // Forces re-render when the date changes
            value={currentDate}
            onClickDay={handleDayClick}
            tileClassName={({ date }) => {
              // Highlight the current day
              if (date.toDateString() === new Date().toDateString()) {
                return "react-calendar__tile--now";
              }
              // Highlight the user-selected day
              if (selectedDay === date.toISOString().split("T")[0]) {
                return "react-calendar__tile--user-selected";
              }
              return null; // Default style
            }}
            showNavigation={false} // Disable default navigation
          />
        </div>
        <div className="menu">
          {selectedDay && (
            <div>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="time-slot-dropdown"
              >
                <option value="">Select a time slot</option>
                {generateTimeSlots().map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <button
                className={`book-appointment-button ${
                  selectedDay && timeSlot ? "enabled" : "disabled"
                }`}
                onClick={handleBookAppointment}
                disabled={!selectedDay || !timeSlot}
              >
                Book Appointment
              </button>
            </div>
          )}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 23; hour++) {
    slots.push(formatTime(hour, 0)); // Add ":00" time
    if (hour < 23) {
      slots.push(formatTime(hour, 30)); // Add ":30" time
    }
  }
  return slots;
};

const formatTime = (hour, minute) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 24-hour to 12-hour format
  return `${String(formattedHour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )} ${suffix}`;
};

export default CalendarPage;

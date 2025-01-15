import React, { useState } from "react";
import Calendar from "react-calendar";
import "../styles/calendar.css";

const CalendarPage = () => {
  const [selectedDay, setSelectedDay] = useState(null); // Stores the currently selected day
  const [timeSlot, setTimeSlot] = useState(""); // Stores the selected time slot
  const [errorMessage, setErrorMessage] = useState(""); // Stores any error messages
  const [currentDate, setCurrentDate] = useState(new Date()); // Keeps track of the currently displayed date
  const [calendarView, setCalendarView] = useState("month"); // Defines the current view (month/year)

  // Handles logic when a user clicks on a specific day in the calendar
  const handleDayClick = (date) => {
    const today = new Date();

    setErrorMessage(""); // Reset any existing error messages

    // Backend Note: Ensure the backend validates whether the selected date is in the past or present.
    if (date <= today.setHours(0, 0, 0, 0)) {
      setErrorMessage("Booking unavailable for the selected date."); // Display error for invalid date
      setSelectedDay(null); // Clear the selected day since it's invalid
      return;
    }

    // Backend Note: Capture the selected date in ISO format for server processing.
    setSelectedDay(date.toISOString().split("T")[0]);
    setTimeSlot(""); // Reset time slot selection
  };

  // Handles logic to navigate the calendar back to today's date
  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today); // Set the calendar to today's date
    setCalendarView("month"); // Reset to month view for consistency
  };

  // Disables specific calendar tiles based on certain conditions
  const tileDisabled = ({ date, view }) => {
    if (view === "year") {
      // Backend Note: Ensure past years are disabled when sending available dates.
      return date.getFullYear() < new Date().getFullYear();
    }
    return false;
  };

  // Handles booking confirmation when the "Book Appointment" button is clicked
  const handleBookAppointment = () => {
    if (!selectedDay || !timeSlot) {
      // Backend Note: Both the selected date and time slot must be validated server-side before proceeding.
      setErrorMessage("Please select a day and a time slot.");
      return;
    }

    // Backend Note: Send `selectedDay` and `timeSlot` to the backend for storing the booking information.
    console.log(`Appointment booked for ${selectedDay} at ${timeSlot}`);
    setSelectedDay(null); // Reset the selected day
    setTimeSlot(""); // Reset the time slot
  };

  return (
    <div className="calendar-page">
      <div className="content">
        <div className="calendar-container">
          <div className="calendar-header">
            <Calendar
              onClickDay={handleDayClick} // Triggered when a user clicks a day
              tileDisabled={tileDisabled} // Dynamically disable certain tiles (e.g., past years)
              value={currentDate} // Sets the current date on the calendar
              view={calendarView} // Controls the current view (month/year)
              prev2Label={null} // Removes navigation for double-left year navigation
              next2Label={null} // Removes navigation for double-right year navigation
              tileClassName={({ date }) =>
                date.toDateString() === new Date().toDateString()
                  ? "today-highlight" // Highlight today's date
                  : ""
              }
              navigationLabel={({ date, label, locale }) => (
                <div className="navigation-container">
                  <span>{label}</span>
                  <button className="today-button" onClick={handleTodayClick}>
                    Today
                  </button>
                </div>
              )}
            />
          </div>
        </div>
        <div className="menu">
          {selectedDay && (
            <div>
              <select
                value={timeSlot} // Selected time slot
                onChange={(e) => setTimeSlot(e.target.value)} // Updates the selected time slot
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
                className="book-appointment-button"
                onClick={handleBookAppointment} // Triggered when booking is attempted
                disabled={!timeSlot} // Disabled until a time slot is selected
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

// Generates time slots from 07:00 to 23:00 with 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 22; hour++) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
    slots.push(`${String(hour).padStart(2, "0")}:30`);
  }
  slots.push("23:00");
  return slots;
};

export default CalendarPage;

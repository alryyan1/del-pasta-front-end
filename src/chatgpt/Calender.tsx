import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Day } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { enUS } from "date-fns/locale";
import axiosClient from "@/helpers/axios-client";
import dayjs from "dayjs";
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ReservationCalendar = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: dayjs(new Date()).format('YYYY-MM-DD'),
    end: dayjs(new Date()).format('YYYY-MM-DD'),
  });
  console.log(newEvent,'new event')

  // Fetch events
  useEffect(() => {
    axiosClient
      .get("reservations")
      .then(({data:{orderReservations,reservations}}) =>{
        const foodReservationsAndDateReservations = [...orderReservations,...reservations]
        const formattedEvents = foodReservationsAndDateReservations.map(event => ({
            ...event,
            start: new Date(event.start), // Ensure start is a Date object
            end: new Date(event.end),     // Ensure end is a Date object
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: "", start, end });
    setOpen(true);
  };

  const handleSave = () => {
    const event = selectedEvent || newEvent;
    if (selectedEvent) {
      // Update event
      axiosClient.put(`reservations/${event.id}`, event).then((response) => {
        setEvents(
          events.map((ev) => (ev.id === response.data.id ? response.data : ev))
        );
      });
    } else {
      // Create event
      axiosClient
        .post("reservations",newEvent)
        .then(({data}) => {
            const formatedEvent = {
                ...data.data,
                start: new Date(data.data.start), // Ensure start is a Date object
                end: new Date(data.data.end),     // Ensure end is a Date object
            }
            setEvents((events)=>{
              return  [...events, formatedEvent]
            });
        });
    }
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      axiosClient
        .delete(`reservations/${selectedEvent.id}`)
        .then(({data}) => {
                if (data.status) {
                    
                    setEvents(events.filter((ev) => ev.id !== selectedEvent.id))
                }
        }
        );
      handleClose();
    }
  };

  return (
    <div style={{direction:'ltr'}}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 500,  }}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedEvent ? "Edit Reservation" : "New Reservation"}
        </DialogTitle>
        <DialogContent>
          <TextField
           multiline
            rows={12}
            sx={{width:'500px'}}
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={selectedEvent ? selectedEvent.title : newEvent.title}
            onChange={(e) =>
              selectedEvent
                ? setSelectedEvent({ ...selectedEvent, title: e.target.value })
                : setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          {selectedEvent && (
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          )}
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReservationCalendar;

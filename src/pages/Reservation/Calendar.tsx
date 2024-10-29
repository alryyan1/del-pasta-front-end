import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Reservation } from './types'; 

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  reservations: Reservation[];
  onSelectSlot: (slotInfo: any) => void;
}

export default function Calendar({ reservations, onSelectSlot }: CalendarProps) {
  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow-lg">
      <BigCalendar
        localizer={localizer}
        events={reservations}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={onSelectSlot}
        views={['month', 'week', 'day']}
        defaultView="week"
        min={new Date(0, 0, 0, 10, 0, 0)} // Restaurant opens at 10 AM
        max={new Date(0, 0, 0, 22, 0, 0)} // Restaurant closes at 10 PM
        className="font-sans"
      />
    </div>
  );
}
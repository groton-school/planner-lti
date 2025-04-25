import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';

export function replaceContent(parent: Element, options: CalendarOptions = {}) {
  const calendarElt = document.createElement('div');
  calendarElt.id = 'calendar';
  const calendar = new Calendar(calendarElt, {
    plugins: [dayGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'today prev,next',
      center: 'title',
      end: 'dayGridWeek,dayGridMonth,listWeek'
    },
    ...options
  });
  parent.replaceChildren(calendarElt);
  calendar.render();
  return calendar;
}

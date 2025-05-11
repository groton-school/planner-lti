import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

let calendar: Calendar | undefined = undefined;

const READY = 'calendar.ready';

export function replaceContent(
  selector: string,
  options: CalendarOptions = {}
) {
  const elt = document.querySelector(selector) as HTMLElement;
  if (!elt) {
    throw new Error(`${selector} not found in DOM`);
  }
  elt.innerHTML = '';
  calendar = new Calendar(elt, {
    plugins: [dayGridPlugin, listPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      start: 'today prev,next',
      center: 'title',
      end: 'timeGridWeek,dayGridMonth,listWeek'
    },
    ...options
  });
  calendar.render();
  document.dispatchEvent(new Event(READY));
}

export function addEvent(event: EventInput) {
  if (!calendar) {
    document.addEventListener(READY, () => addEvent(event));
    return;
  }
  if (event.id) {
    if (!calendar.getEventById(event.id)) {
      calendar.addEvent(event);
    }
  }
}

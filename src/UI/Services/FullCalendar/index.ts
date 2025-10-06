import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import './canvas-calendar.scss';
import './styles.scss';

let instance: Calendar | undefined = undefined;

const READY = 'calendar.ready';

export type Options = { selector?: string; options?: CalendarOptions };

export function init({ selector = '#calendar', options }: Options) {
  const elt = document.querySelector(selector) as HTMLElement;
  if (!elt) {
    throw new Error(`${selector} not found in DOM`);
  }
  elt.innerHTML = '';
  instance = new Calendar(elt, {
    plugins: [dayGridPlugin, listPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      start: 'today prev,next',
      center: 'title',
      // TODO separate duration/presentation options
      end: 'timeGridWeek,dayGridMonth,listWeek'
    },
    ...options
  });
  instance.render();
  document.dispatchEvent(new Event(READY));
}

export function getInstance() {
  if (!instance) {
    throw new Error('FullCalendar not initialized');
  }
  return instance;
}

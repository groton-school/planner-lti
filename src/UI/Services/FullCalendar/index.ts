import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { titleCase } from 'change-case-all';
import { CalendarView } from '../Preferences';
import './canvaslms.scss';
import './styles.scss';

export type Options = { selector?: string; options?: CalendarOptions };

const Active = 'fc-button-active';

type ViewStyle = 'grid' | 'list';
type ViewDuration = 'day' | 'week' | 'month';

let instance: Calendar | undefined = undefined;

export function getInstance() {
  if (!instance) {
    throw new Error('FullCalendar not initialized');
  }
  return instance;
}

const views: Record<ViewStyle, Record<ViewDuration, string>> = {
  grid: {
    day: 'timeGridDay',
    week: 'timeGridWeek',
    month: 'dayGridMonth'
  },
  list: {
    day: 'listDay',
    week: 'listWeek',
    month: 'listMonth'
  }
};

let currentDuration: ViewDuration = 'week';
let currentStyle: ViewStyle = 'grid';

export function changeView(
  style: ViewStyle,
  duration: ViewDuration,
  elt: HTMLElement
) {
  currentStyle = style;
  currentDuration = duration;
  toggleActiveView(elt);
  getInstance().changeView(views[currentStyle][currentDuration]);
  CalendarView.save(currentDuration, currentStyle);
}

function toggleActiveView(elt: HTMLElement) {
  for (const button of elt.closest('.btn-group')?.querySelectorAll('.btn') ||
    []) {
    button.classList.remove(Active);
    button.removeAttribute('disabled');
  }
  const button = elt.closest('.btn');
  button?.classList.add(Active);
  button?.setAttribute('disabled', 'true');
}

export function init({ selector = '#calendar', options }: Options) {
  const elt = document.querySelector<HTMLElement>(selector);
  if (!elt) {
    throw new Error(`${selector} not found in DOM`);
  }
  const { d, s } = CalendarView.load();
  currentDuration = d;
  currentStyle = s;
  elt.innerHTML = '';
  instance = new Calendar(elt, {
    plugins: [dayGridPlugin, listPlugin, timeGridPlugin, bootstrap5Plugin],
    themeSystem: 'bootstrap5',
    initialView: views[currentStyle][currentDuration],
    eventDisplay: 'block',

    customButtons: {
      toDay: {
        text: 'Day',
        icon: 'calendar-event',
        click: (event, elt) => changeView(currentStyle, 'day', elt)
      },
      toWeek: {
        text: 'Week',
        icon: 'calendar-week',
        click: (event, elt) => changeView(currentStyle, 'week', elt)
      },
      toMonth: {
        text: 'Month',
        icon: 'calendar3',
        click: (event, elt) => changeView(currentStyle, 'month', elt)
      },
      toGrid: {
        text: 'Grid',
        icon: 'grid-fill',
        click: (event, elt) => changeView('grid', currentDuration, elt)
      },
      toList: {
        text: 'List',
        icon: 'list-task',
        click: (event, elt) => changeView('list', currentDuration, elt)
      }
    },

    headerToolbar: {
      start: 'today prev,next',
      center: 'title',
      end: 'toDay,toWeek,toMonth toGrid,toList'
    },

    ...options
  });
  instance.render();

  for (const button of document.querySelectorAll(
    `.fc-to${titleCase(currentDuration)}-button, .fc-to${titleCase(currentStyle)}-button`
  )) {
    button.classList.add(Active);
    button.setAttribute('disabled', 'true');
  }
}

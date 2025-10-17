/* eslint-disable no-async-promise-executor */
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Calendar, DatesSetArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import './CalendarSelector';
import './canvaslms.scss';
import './styles.scss';
import { ViewSelector } from './ViewSelector';

export const element =
  document.getElementById('calendar') || document.createElement('div');

class InitialViewEvent extends Event {
  public static readonly name = 'fc-initialView';
  public constructor(public readonly initialView: string) {
    super(InitialViewEvent.name);
  }
}

export function setInitialView(initialView: string) {
  element.dispatchEvent(new InitialViewEvent(initialView));
}

const initialView = new Promise<string>(async (resolve, reject) => {
  element.addEventListener(InitialViewEvent.name, (event) =>
    'initialView' in event ? resolve(event.initialView as string) : reject()
  );
});

class DatesSetEvent extends Event {
  public static readonly name = 'fc-datesSet';
  public constructor(public readonly datesSet: (arg: DatesSetArg) => void) {
    super(DatesSetEvent.name);
  }
}

export function setDatesSetHandler(handler: (arg: DatesSetArg) => void) {
  element.dispatchEvent(new DatesSetEvent(handler));
}

const datesSet = new Promise<(arg: DatesSetArg) => void>(
  async (resolve, reject) => {
    element.addEventListener(DatesSetEvent.name, (event) =>
      'datesSet' in event
        ? resolve(event.datesSet as (arg: DatesSetArg) => void)
        : reject()
    );
  }
);

export const instance = new Promise<Calendar>(async (resolve) => {
  resolve(
    new Calendar(element, {
      plugins: [dayGridPlugin, listPlugin, timeGridPlugin, bootstrap5Plugin],
      themeSystem: 'bootstrap5',
      eventDisplay: 'block',
      initialView: await initialView,
      datesSet: await datesSet
    })
  );
});

async function initialize() {
  const viewSelector = new ViewSelector(instance);
  setInitialView(viewSelector.view);
  (await instance).setOption('customButtons', viewSelector.CustomButtons);
  (await instance).setOption('headerToolbar', {
    start: 'today prev,next',
    center: 'title',
    end: viewSelector.toolbar
  });
  (await instance).render();
}

initialize();

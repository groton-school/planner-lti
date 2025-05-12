import { index_of_active_global_notification_for_user } from '@groton/canvas-cli.api/dist/Endpoints/V1/Accounts/AccountNotifications';
import * as Canvas from './Canvas';
import * as FullCalendar from './FullCalendar';
import * as Google from './Google';
import './styles.scss';

(async () => {
  document.addEventListener('DOMContentLoaded', async () => {
    const todoElt = document.querySelector('#todo');
    if (!todoElt) {
      throw new Error(`Missing #todo element`);
    }
    Canvas.Colors.get();
    await Canvas.Course.list();
    FullCalendar.replaceContent('#calendar', {
      eventClick: async (info) => {
        if (Canvas.CalendarEvent.isAssociated(info)) {
          const assignment: Canvas.Assignment | undefined =
            Canvas.CalendarEvent.fromEventId(info.event.id).assignment;
          if (assignment) {
            assignment.detail(info);
          }
        } else if (Google.CalendarEvent.isAssociated(info)) {
          await Google.CalendarEvent.fromEventId(info.event.id).detail(info);
        }
      },
      datesSet: (info) => {
        Google.CalendarEvent.list({
          params: {
            timeMin: info.view.activeStart.toISOString(),
            timeMax: info.view.activeEnd.toISOString()
          }
        }).then((classMeetings) => {
          for (const classMeeting of classMeetings) {
            FullCalendar.addEvent(classMeeting.toEvent());
          }
        });
        Canvas.Course.list().then((courses) => {
          for (let i = 0; i < courses.length; i += 10) {
            Canvas.CalendarEvent.list({
              params: {
                context_codes: courses
                  .slice(i, i + 10)
                  .map((course) => course.context_code),
                type: 'assignment',
                start_date: info.view.activeStart.toISOString(),
                end_date: info.view.activeEnd.toISOString()
              },
              callback: (calendarEvent) => {
                FullCalendar.addEvent(calendarEvent.toEvent());
              }
            });
          }
        });
      }
    });
    Canvas.PlannerItem.list({
      callback: async (item) => {
        if (!item.isEvent()) {
          if (item.done) {
            todoElt.querySelector('#done')?.appendChild(await item.toTodo());
          } else {
            todoElt
              .querySelector('#incomplete')
              ?.appendChild(await item.toTodo());
          }
        }
      }
    });
  });
  document.addEventListener('hidden.bs.modal', () =>
    (this as HTMLElement | undefined)?.remove()
  );
})();

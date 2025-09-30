import { RequestComplete, RequestStarted } from '@groton/canvas-api.client.web';
import * as Activity from './Activity';
import * as Canvas from './Canvas';
import * as FullCalendar from './FullCalendar';
import * as Google from './Google';
import './styles.scss';

(async () => {
  document.addEventListener(RequestStarted, () => Activity.show());
  document.addEventListener(RequestComplete, () => Activity.hide());
  document.addEventListener('DOMContentLoaded', async () => {
    const todoElt = document.querySelector('#todo');
    if (!todoElt) {
      throw new Error(`Missing #todo element`);
    }
    Canvas.Colors.get();
    FullCalendar.replaceContent('#calendar', {
      eventClick: async (info) => {
        if (Canvas.CalendarEvent.isAssociated(info)) {
          const assignment: Canvas.Assignment | undefined =
            Canvas.CalendarEvent.fromEventId(info.event.id).assignment;
          if (assignment) {
            assignment.detail(info);
          }
        } else if (Canvas.Assignment.isAssociated(info)) {
          Canvas.Assignment.fromEventId(info.event.id).detail(info);
        } else if (Google.CalendarEvent.isAssociated(info)) {
          await Google.CalendarEvent.fromEventId(info.event.id).detail(info);
        }
      },
      datesSet: (info) => {
        Canvas.Course.list({
          state: ['available'],
          include: ['sections']
        }).then((courses) => {
          Google.CalendarEvent.list({
            params: {
              timeMin: info.view.activeStart.toISOString(),
              timeMax: info.view.activeEnd.toISOString(),
              singleEvents: 'true'
            }
          }).then((classMeetings) => {
            for (const classMeeting of classMeetings) {
              FullCalendar.addEvent(classMeeting.toEvent());
            }
          });

          for (let i = 0; i < courses.length; i += 10) {
            Canvas.CalendarEvent.list(
              {
                context_codes: courses
                  .slice(i, i + 10)
                  .filter((course) => course.isTeacher())
                  .map((course) => course.context_code),
                type: 'assignment',
                start_date: info.view.activeStart.toISOString(),
                end_date: info.view.activeEnd.toISOString()
              },
              (calendarEvent) => {
                FullCalendar.addEvent(calendarEvent.toEvent());
              }
            );
          }
        });
      }
    });
    (await Canvas.PlannerItem.list()).map(async (item) => {
      if (!item.isEvent()) {
        if (item.isDone()) {
          todoElt.querySelector('#done')?.appendChild(await item.toTodo());
        } else {
          todoElt
            .querySelector('#incomplete')
            ?.appendChild(await item.toTodo());
        }
      } else {
        FullCalendar.addEvent(item.toEvent());
      }
    });
  });
  document.addEventListener('hidden.bs.modal', () =>
    (this as HTMLElement | undefined)?.remove()
  );
})();
